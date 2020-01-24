'use strict';

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var utils         = require('../utils/common');
var adler32       = require('./adler32');
var inflate_fast  = require('./inffast');
var inflate_table = require('./inftrees');

var CODES = 0;
var LENS = 1;
var DISTS = 2;

/* Public constants ==========================================================*/
/* ===========================================================================*/


/* Allowed flush values; see deflate() and inflate() below for details */
//var _Z_NO_FLUSH      = 0;
//var _Z_PARTIAL_FLUSH = 1;
//var _Z_SYNC_FLUSH    = 2;
//var _Z_FULL_FLUSH    = 3;
var _Z_FINISH        = 4;
var _Z_BLOCK         = 5;
var _Z_TREES         = 6;


/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
var _Z_OK            = 0;
var _Z_STREAM_END    = 1;
var _Z_NEED_DICT     = 2;
//var _Z_ERRNO         = -1;
var _Z_STREAM_ERROR  = -2;
var _Z_DATA_ERROR    = -3;
var _Z_MEM_ERROR     = -4;
var _Z_BUF_ERROR     = -5;
//var _Z_VERSION_ERROR = -6;

/* The deflate compression method */
var _Z_DEFLATED  = 8;


/* STATES ====================================================================*/
/* ===========================================================================*/


var    HEAD = 1;       /* i: waiting for magic header */
var    FLAGS = 2;      /* i: waiting for method and flags (gzip) */
var    TIME = 3;       /* i: waiting for modification time (gzip) */
var    OS = 4;         /* i: waiting for extra flags and operating system (gzip) */
var    EXLEN = 5;      /* i: waiting for extra length (gzip) */
var    EXTRA = 6;      /* i: waiting for extra bytes (gzip) */
var    NAME = 7;       /* i: waiting for end of file name (gzip) */
var    COMMENT = 8;    /* i: waiting for end of comment (gzip) */
var    HCRC = 9;       /* i: waiting for header crc (gzip) */
var    DICTID = 10;    /* i: waiting for dictionary check value */
var    DICT = 11;      /* waiting for inflateSetDictionary() call */
var        TYPE = 12;      /* i: waiting for type bits, including last-flag bit */
var        TYPEDO = 13;    /* i: same, but skip check to exit inflate on new block */
var        STORED = 14;    /* i: waiting for stored size (length and complement) */
var        COPY_ = 15;     /* i/o: same as COPY below, but only first time in */
var        COPY = 16;      /* i/o: waiting for input or output to copy stored block */
var        TABLE = 17;     /* i: waiting for dynamic block table lengths */
var        LENLENS = 18;   /* i: waiting for code length code lengths */
var        CODELENS = 19;  /* i: waiting for length/lit and distance code lengths */
var            LEN_ = 20;      /* i: same as LEN below, but only first time in */
var            LEN = 21;       /* i: waiting for length/lit/eob code */
var            LENEXT = 22;    /* i: waiting for length extra bits */
var            DIST = 23;      /* i: waiting for distance code */
var            DISTEXT = 24;   /* i: waiting for distance extra bits */
var            MATCH = 25;     /* o: waiting for output space to copy string */
var            LIT = 26;       /* o: waiting for output space to write literal */
var    CHECK = 27;     /* i: waiting for 32-bit check value */
var    LENGTH = 28;    /* i: waiting for 32-bit length (gzip) */
var    DONE = 29;      /* finished check, done -- remain here until reset */
var    BAD = 30;       /* got a data error -- remain here until reset */
var    MEM = 31;       /* got an inflate() memory error -- remain here until reset */
var    SYNC = 32;      /* looking for synchronization bytes to restart inflate() */

/* ===========================================================================*/



var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;
//var ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

var MAX_WBITS = 15;
/* 32K LZ77 _window */
var DEF_WBITS = MAX_WBITS;


function zswap32(q) {
  return  (((q >>> 24) & 0xff) +
          ((q >>> 8) & 0xff00) +
          ((q & 0xff00) << 8) +
          ((q & 0xff) << 24));
}


function InflateState() {
  this._mode = 0;             /* current inflate _mode */
  this.last = false;          /* true if processing last block */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.havedict = false;      /* true if dictionary provided */
  this.flags = 0;             /* gzip header method and flags (0 if zlib) */
  this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
  this.check = 0;             /* protected copy of check value */
  this.total = 0;             /* protected copy of output count */
  // TODO: may be {}
  this.head = null;           /* where to save gzip header information */

  /* sliding _window */
  this.wbits = 0;             /* log base 2 of requested _window size */
  this.wsize = 0;             /* _window size or zero if not using _window */
  this.whave = 0;             /* valid bytes in the _window */
  this.wnext = 0;             /* _window write index */
  this._window = null;         /* allocated sliding _window, if needed */

  /* bit accumulator */
  this.hold = 0;              /* input bit accumulator */
  this.bits = 0;              /* number of bits in "in" */

  /* for string and stored block copying */
  this.length = 0;            /* literal or length of data to copy */
  this.offset = 0;            /* distance back to copy string from */

  /* for table and code decoding */
  this.extra = 0;             /* extra bits needed */

  /* fixed and dynamic code tables */
  this.lencode = null;          /* starting table for length/literal codes */
  this.distcode = null;         /* starting table for distance codes */
  this.lenbits = 0;           /* index bits for lencode */
  this.distbits = 0;          /* index bits for distcode */

  /* dynamic table building */
  this.ncode = 0;             /* number of code length code lengths */
  this.nlen = 0;              /* number of length code lengths */
  this.ndist = 0;             /* number of distance code lengths */
  this.have = 0;              /* number of code lengths in lens[] */
  this.next = null;              /* next available space in codes[] */

  this.lens = new utils.Buf16(320); /* temporary storage for code lengths */
  this.work = new utils.Buf16(288); /* work area for code table building */

  /*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  */
  //this.codes = new utils.Buf32(ENOUGH);       /* space for code tables */
  this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
  this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
  this.sane = 0;                   /* if false, allow invalid distance too far */
  this.back = 0;                   /* bits back of last unprocessed length/lit */
  this.was = 0;                    /* initial length of match */
}

function inflateResetKeep(_strm) {
  var _state;

  if (!_strm || !_strm._state) { return _Z_STREAM_ERROR; }
  _state = _strm._state;
  _strm.total_in = _strm.total_out = _state.total = 0;
  _strm.msg = ''; /*Z_NULL*/
  if (_state.wrap) {       /* to support ill-conceived Java test suite */
    _strm.adler = _state.wrap & 1;
  }
  _state._mode = HEAD;
  _state.last = 0;
  _state.havedict = 0;
  _state.dmax = 32768;
  _state.head = null/*Z_NULL*/;
  _state.hold = 0;
  _state.bits = 0;
  //_state.lencode = _state.distcode = _state.next = _state.codes;
  _state.lencode = _state.lendyn = new utils.Buf32(ENOUGH_LENS);
  _state.distcode = _state.distdyn = new utils.Buf32(ENOUGH_DISTS);

  _state.sane = 1;
  _state.back = -1;
  //Tracev((stderr, "inflate: reset\n"));
  return _Z_OK;
}

function inflateReset(_strm) {
  var _state;

  if (!_strm || !_strm._state) { return _Z_STREAM_ERROR; }
  _state = _strm._state;
  _state.wsize = 0;
  _state.whave = 0;
  _state.wnext = 0;
  return inflateResetKeep(_strm);

}

function inflateReset2(_strm, _windowBits) {
  var wrap;
  var _state;

  /* get the _state */
  if (!_strm || !_strm._state) { return _Z_STREAM_ERROR; }
  _state = _strm._state;

  /* extract wrap request from _windowBits parameter */
  if (_windowBits < 0) {
    wrap = 0;
    _windowBits = -_windowBits;
  }
  else {
    wrap = (_windowBits >> 4) + 1;
    if (_windowBits < 48) {
      _windowBits &= 15;
    }
  }

  /* set number of _window bits, free _window if different */
  if (_windowBits && (_windowBits < 8 || _windowBits > 15)) {
    return _Z_STREAM_ERROR;
  }
  if (_state._window !== null && _state.wbits !== _windowBits) {
    _state._window = null;
  }

  /* update _state and reset the rest of it */
  _state.wrap = wrap;
  _state.wbits = _windowBits;
  return inflateReset(_strm);
}

function inflateInit2(_strm, _windowBits) {
  var ret;
  var _state;

  if (!_strm) { return _Z_STREAM_ERROR; }
  //_strm.msg = Z_NULL;                 /* in case we return an error */

  _state = new InflateState();

  //if (_state === Z_NULL) return _Z_MEM_ERROR;
  //Tracev((stderr, "inflate: allocated\n"));
  _strm._state = _state;
  _state._window = null/*Z_NULL*/;
  ret = inflateReset2(_strm, _windowBits);
  if (ret !== _Z_OK) {
    _strm._state = null/*Z_NULL*/;
  }
  return ret;
}


/*
 Return _state with length and distance decoding tables and index sizes set to
 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
 If BUILDFIXED is defined, then instead this routine builds the tables the
 first time it's called, and returns those tables the first time and
 thereafter.  This reduces the size of the code by about 2K bytes, in
 exchange for a little execution time.  However, BUILDFIXED should not be
 used for threaded applications, since the rewriting of the tables and virgin
 may not be thread-safe.
 */
var virgin = true;

var lenfix, distfix; // We have no pointers in JS, so keep tables separate

function fixedtables(_state) {
  /* build fixed huffman tables if first call (may not be thread safe) */
  if (virgin) {
    var sym;

    lenfix = new utils.Buf32(512);
    distfix = new utils.Buf32(32);

    /* literal/length table */
    sym = 0;
    while (sym < 144) { _state.lens[sym++] = 8; }
    while (sym < 256) { _state.lens[sym++] = 9; }
    while (sym < 280) { _state.lens[sym++] = 7; }
    while (sym < 288) { _state.lens[sym++] = 8; }

    inflate_table(LENS,  _state.lens, 0, 288, lenfix,   0, _state.work, { bits: 9 });

    /* distance table */
    sym = 0;
    while (sym < 32) { _state.lens[sym++] = 5; }

    inflate_table(DISTS, _state.lens, 0, 32,   distfix, 0, _state.work, { bits: 5 });

    /* do this just once */
    virgin = false;
  }

  _state.lencode = lenfix;
  _state.lenbits = 9;
  _state.distcode = distfix;
  _state.distbits = 5;
}


/*
 Update the _window with the last wsize (normally 32K) bytes written before
 returning.  If _window does not exist yet, create it.  This is only called
 when a _window is already in use, or when output has been written during this
 inflate call, but the end of the deflate stream has not been reached yet.
 It is also called to create a _window for dictionary data when a dictionary
 is loaded.

 Providing output buffers larger than 32K to inflate() should provide a speed
 advantage, since only the last 32K of output is copied to the sliding window
 upon return from inflate(), and since all distances after the first 32K of
 output will fall in the output data, making match copies simpler and faster.
 The advantage may be dependent on the size of the processor's data caches.
 */
function update_window(_strm, src, end, copy) {
  var dist;
  var _state = _strm._state;

  /* if it hasn't been done already, allocate space for the _window */
  if (_state._window === null) {
    _state.wsize = 1 << _state.wbits;
    _state.wnext = 0;
    _state.whave = 0;

    _state._window = new utils.Buf8(_state.wsize);
  }

  /* copy _state->wsize or less output bytes into the circular _window */
  if (copy >= _state.wsize) {
    utils.arraySet(_state._window, src, end - _state.wsize, _state.wsize, 0);
    _state.wnext = 0;
    _state.whave = _state.wsize;
  }
  else {
    dist = _state.wsize - _state.wnext;
    if (dist > copy) {
      dist = copy;
    }
    //zmemcpy(_state->_window + _state->wnext, end - copy, dist);
    utils.arraySet(_state._window, src, end - copy, dist, _state.wnext);
    copy -= dist;
    if (copy) {
      //zmemcpy(_state->_window, end - copy, copy);
      utils.arraySet(_state._window, src, end - copy, copy, 0);
      _state.wnext = copy;
      _state.whave = _state.wsize;
    }
    else {
      _state.wnext += dist;
      if (_state.wnext === _state.wsize) { _state.wnext = 0; }
      if (_state.whave < _state.wsize) { _state.whave += dist; }
    }
  }
  return 0;
}

function inflate(_strm, flush) {
  var _state;
  var input, output;          // input/output buffers
  var next;                   /* next input INDEX */
  var put;                    /* next output INDEX */
  var have, left;             /* available input and output */
  var hold;                   /* bit buffer */
  var bits;                   /* bits in bit buffer */
  var _in, _out;              /* save starting available input and output */
  var copy;                   /* number of stored or match bytes to copy */
  var from;                   /* where to copy match bytes from */
  var from_source;
  var here = 0;               /* current decoding table entry */
  var here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
  //var last;                   /* parent table entry */
  var last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
  var len;                    /* length to copy for repeats, bits to drop */
  var ret;                    /* return code */
  var hbuf = new utils.Buf8(4);    /* buffer for gzip header crc calculation */
  var opts;

  var n; // temporary var for NEED_BITS

  var order = /* permutation of code lengths */
    [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ];


  if (!_strm || !_strm._state || !_strm.output ||
      (!_strm._input && _strm._avail_in !== 0)) {
    return _Z_STREAM_ERROR;
  }

  _state = _strm._state;
  if (_state._mode === TYPE) { _state._mode = TYPEDO; }    /* skip check */


  //--- LOAD() ---
  put = _strm._next_out;
  output = _strm.output;
  left = _strm._avail_out;
  next = _strm._next_in;
  input = _strm._input;
  have = _strm._avail_in;
  hold = _state.hold;
  bits = _state.bits;
  //---

  _in = have;
  _out = left;
  ret = _Z_OK;

  inf_leave: // goto emulation
  for (;;) {
    switch (_state._mode) {
      case HEAD:
        if (_state.wrap === 0) {
          _state._mode = TYPEDO;
          break;
        }
        //=== NEEDBITS(16);
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        _state.flags = 0;           /* expect zlib header */
        if (_state.head) {
          _state.head.done = false;
        }
        if (!(_state.wrap & 1) ||   /* check if zlib header allowed */
          (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
          _strm.msg = 'incorrect header check';
          _state._mode = BAD;
          break;
        }
        if ((hold & 0x0f)/*BITS(4)*/ !== _Z_DEFLATED) {
          _strm.msg = 'unknown compression method';
          _state._mode = BAD;
          break;
        }
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
        len = (hold & 0x0f)/*BITS(4)*/ + 8;
        if (_state.wbits === 0) {
          _state.wbits = len;
        }
        else if (len > _state.wbits) {
          _strm.msg = 'invalid _window size';
          _state._mode = BAD;
          break;
        }
        _state.dmax = 1 << len;
        //Tracev((stderr, "inflate:   zlib header ok\n"));
        _strm.adler = _state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        _state._mode = hold & 0x200 ? DICTID : TYPE;
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        break;
      case DICTID:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        _strm.adler = _state.check = zswap32(hold);
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        _state._mode = DICT;
        /* falls through */
      case DICT:
        if (_state.havedict === 0) {
          //--- RESTORE() ---
          _strm._next_out = put;
          _strm._avail_out = left;
          _strm._next_in = next;
          _strm._avail_in = have;
          _state.hold = hold;
          _state.bits = bits;
          //---
          return _Z_NEED_DICT;
        }
        _strm.adler = _state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        _state._mode = TYPE;
        /* falls through */
      case TYPE:
        if (flush === _Z_BLOCK || flush === _Z_TREES) { break inf_leave; }
        /* falls through */
      case TYPEDO:
        if (_state.last) {
          //--- BYTEBITS() ---//
          hold >>>= bits & 7;
          bits -= bits & 7;
          //---//
          _state._mode = CHECK;
          break;
        }
        //=== NEEDBITS(3); */
        while (bits < 3) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        _state.last = (hold & 0x01)/*BITS(1)*/;
        //--- DROPBITS(1) ---//
        hold >>>= 1;
        bits -= 1;
        //---//

        switch ((hold & 0x03)/*BITS(2)*/) {
          case 0:                             /* stored block */
            //Tracev((stderr, "inflate:     stored block%s\n",
            //        _state.last ? " (last)" : ""));
            _state._mode = STORED;
            break;
          case 1:                             /* fixed block */
            fixedtables(_state);
            //Tracev((stderr, "inflate:     fixed codes block%s\n",
            //        _state.last ? " (last)" : ""));
            _state._mode = LEN_;             /* decode codes */
            if (flush === _Z_TREES) {
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
              break inf_leave;
            }
            break;
          case 2:                             /* dynamic block */
            //Tracev((stderr, "inflate:     dynamic codes block%s\n",
            //        _state.last ? " (last)" : ""));
            _state._mode = TABLE;
            break;
          case 3:
            _strm.msg = 'invalid block type';
            _state._mode = BAD;
        }
        //--- DROPBITS(2) ---//
        hold >>>= 2;
        bits -= 2;
        //---//
        break;
      case STORED:
        //--- BYTEBITS() ---// /* go to byte boundary */
        hold >>>= bits & 7;
        bits -= bits & 7;
        //---//
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
          _strm.msg = 'invalid stored block lengths';
          _state._mode = BAD;
          break;
        }
        _state.length = hold & 0xffff;
        //Tracev((stderr, "inflate:       stored length %u\n",
        //        _state.length));
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        _state._mode = COPY_;
        if (flush === _Z_TREES) { break inf_leave; }
        /* falls through */
      case COPY_:
        _state._mode = COPY;
        /* falls through */
      case COPY:
        copy = _state.length;
        if (copy) {
          if (copy > have) { copy = have; }
          if (copy > left) { copy = left; }
          if (copy === 0) { break inf_leave; }
          //--- zmemcpy(put, next, copy); ---
          utils.arraySet(output, input, next, copy, put);
          //---//
          have -= copy;
          next += copy;
          left -= copy;
          put += copy;
          _state.length -= copy;
          break;
        }
        //Tracev((stderr, "inflate:       stored end\n"));
        _state._mode = TYPE;
        break;
      case TABLE:
        //=== NEEDBITS(14); */
        while (bits < 14) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        _state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        _state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        _state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
//#ifndef PKZIP_BUG_WORKAROUND
        if (_state.nlen > 286 || _state.ndist > 30) {
          _strm.msg = 'too many length or distance symbols';
          _state._mode = BAD;
          break;
        }
//#endif
        //Tracev((stderr, "inflate:       table sizes ok\n"));
        _state.have = 0;
        _state._mode = LENLENS;
        /* falls through */
      case LENLENS:
        while (_state.have < _state.ncode) {
          //=== NEEDBITS(3);
          while (bits < 3) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          _state.lens[order[_state.have++]] = (hold & 0x07);//BITS(3);
          //--- DROPBITS(3) ---//
          hold >>>= 3;
          bits -= 3;
          //---//
        }
        while (_state.have < 19) {
          _state.lens[order[_state.have++]] = 0;
        }
        // We have separate tables & no pointers. 2 commented lines below not needed.
        //_state.next = _state.codes;
        //_state.lencode = _state.next;
        // Switch to use dynamic table
        _state.lencode = _state.lendyn;
        _state.lenbits = 7;

        opts = { bits: _state.lenbits };
        ret = inflate_table(CODES, _state.lens, 0, 19, _state.lencode, 0, _state.work, opts);
        _state.lenbits = opts.bits;

        if (ret) {
          _strm.msg = 'invalid code lengths set';
          _state._mode = BAD;
          break;
        }
        //Tracev((stderr, "inflate:       code lengths ok\n"));
        _state.have = 0;
        _state._mode = CODELENS;
        /* falls through */
      case CODELENS:
        while (_state.have < _state.nlen + _state.ndist) {
          for (;;) {
            here = _state.lencode[hold & ((1 << _state.lenbits) - 1)];/*BITS(_state.lenbits)*/
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          if (here_val < 16) {
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            _state.lens[_state.have++] = here_val;
          }
          else {
            if (here_val === 16) {
              //=== NEEDBITS(here.bits + 2);
              n = here_bits + 2;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              if (_state.have === 0) {
                _strm.msg = 'invalid bit length repeat';
                _state._mode = BAD;
                break;
              }
              len = _state.lens[_state.have - 1];
              copy = 3 + (hold & 0x03);//BITS(2);
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
            }
            else if (here_val === 17) {
              //=== NEEDBITS(here.bits + 3);
              n = here_bits + 3;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 3 + (hold & 0x07);//BITS(3);
              //--- DROPBITS(3) ---//
              hold >>>= 3;
              bits -= 3;
              //---//
            }
            else {
              //=== NEEDBITS(here.bits + 7);
              n = here_bits + 7;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 11 + (hold & 0x7f);//BITS(7);
              //--- DROPBITS(7) ---//
              hold >>>= 7;
              bits -= 7;
              //---//
            }
            if (_state.have + copy > _state.nlen + _state.ndist) {
              _strm.msg = 'invalid bit length repeat';
              _state._mode = BAD;
              break;
            }
            while (copy--) {
              _state.lens[_state.have++] = len;
            }
          }
        }

        /* handle error breaks in while */
        if (_state._mode === BAD) { break; }

        /* check for end-of-block code (better have one) */
        if (_state.lens[256] === 0) {
          _strm.msg = 'invalid code -- missing end-of-block';
          _state._mode = BAD;
          break;
        }

        /* build code tables -- note: do not change the lenbits or distbits
           values here (9 and 6) without reading the comments in inftrees.h
           concerning the ENOUGH constants, which depend on those values */
        _state.lenbits = 9;

        opts = { bits: _state.lenbits };
        ret = inflate_table(LENS, _state.lens, 0, _state.nlen, _state.lencode, 0, _state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // _state._next_index = opts.table_index;
        _state.lenbits = opts.bits;
        // _state.lencode = _state.next;

        if (ret) {
          _strm.msg = 'invalid literal/lengths set';
          _state._mode = BAD;
          break;
        }

        _state.distbits = 6;
        //_state.distcode.copy(_state.codes);
        // Switch to use dynamic table
        _state.distcode = _state.distdyn;
        opts = { bits: _state.distbits };
        ret = inflate_table(DISTS, _state.lens, _state.nlen, _state.ndist, _state.distcode, 0, _state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // _state._next_index = opts.table_index;
        _state.distbits = opts.bits;
        // _state.distcode = _state.next;

        if (ret) {
          _strm.msg = 'invalid distances set';
          _state._mode = BAD;
          break;
        }
        //Tracev((stderr, 'inflate:       codes ok\n'));
        _state._mode = LEN_;
        if (flush === _Z_TREES) { break inf_leave; }
        /* falls through */
      case LEN_:
        _state._mode = LEN;
        /* falls through */
      case LEN:
        if (have >= 6 && left >= 258) {
          //--- RESTORE() ---
          _strm._next_out = put;
          _strm._avail_out = left;
          _strm._next_in = next;
          _strm._avail_in = have;
          _state.hold = hold;
          _state.bits = bits;
          //---
          inflate_fast(_strm, _out);
          //--- LOAD() ---
          put = _strm._next_out;
          output = _strm.output;
          left = _strm._avail_out;
          next = _strm._next_in;
          input = _strm._input;
          have = _strm._avail_in;
          hold = _state.hold;
          bits = _state.bits;
          //---

          if (_state._mode === TYPE) {
            _state.back = -1;
          }
          break;
        }
        _state.back = 0;
        for (;;) {
          here = _state.lencode[hold & ((1 << _state.lenbits) - 1)];  /*BITS(_state.lenbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if (here_bits <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if (here_op && (here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = _state.lencode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          _state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        _state.back += here_bits;
        _state.length = here_val;
        if (here_op === 0) {
          //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
          //        "inflate:         literal '%c'\n" :
          //        "inflate:         literal 0x%02x\n", here.val));
          _state._mode = LIT;
          break;
        }
        if (here_op & 32) {
          //Tracevv((stderr, "inflate:         end of block\n"));
          _state.back = -1;
          _state._mode = TYPE;
          break;
        }
        if (here_op & 64) {
          _strm.msg = 'invalid literal/length code';
          _state._mode = BAD;
          break;
        }
        _state.extra = here_op & 15;
        _state._mode = LENEXT;
        /* falls through */
      case LENEXT:
        if (_state.extra) {
          //=== NEEDBITS(_state.extra);
          n = _state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          _state.length += hold & ((1 << _state.extra) - 1)/*BITS(_state.extra)*/;
          //--- DROPBITS(_state.extra) ---//
          hold >>>= _state.extra;
          bits -= _state.extra;
          //---//
          _state.back += _state.extra;
        }
        //Tracevv((stderr, "inflate:         length %u\n", _state.length));
        _state.was = _state.length;
        _state._mode = DIST;
        /* falls through */
      case DIST:
        for (;;) {
          here = _state.distcode[hold & ((1 << _state.distbits) - 1)];/*BITS(_state.distbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((here_bits) <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if ((here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = _state.distcode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          _state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        _state.back += here_bits;
        if (here_op & 64) {
          _strm.msg = 'invalid distance code';
          _state._mode = BAD;
          break;
        }
        _state.offset = here_val;
        _state.extra = (here_op) & 15;
        _state._mode = DISTEXT;
        /* falls through */
      case DISTEXT:
        if (_state.extra) {
          //=== NEEDBITS(_state.extra);
          n = _state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          _state.offset += hold & ((1 << _state.extra) - 1)/*BITS(_state.extra)*/;
          //--- DROPBITS(_state.extra) ---//
          hold >>>= _state.extra;
          bits -= _state.extra;
          //---//
          _state.back += _state.extra;
        }
//#ifdef INFLATE_STRICT
        if (_state.offset > _state.dmax) {
          _strm.msg = 'invalid distance too far back';
          _state._mode = BAD;
          break;
        }
//#endif
        //Tracevv((stderr, "inflate:         distance %u\n", _state.offset));
        _state._mode = MATCH;
        /* falls through */
      case MATCH:
        if (left === 0) { break inf_leave; }
        copy = _out - left;
        if (_state.offset > copy) {         /* copy from _window */
          copy = _state.offset - copy;
          if (copy > _state.whave) {
            if (_state.sane) {
              _strm.msg = 'invalid distance too far back';
              _state._mode = BAD;
              break;
            }
// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//          Trace((stderr, "inflate.c too far\n"));
//          copy -= _state.whave;
//          if (copy > _state.length) { copy = _state.length; }
//          if (copy > left) { copy = left; }
//          left -= copy;
//          _state.length -= copy;
//          do {
//            output[put++] = 0;
//          } while (--copy);
//          if (_state.length === 0) { _state._mode = LEN; }
//          break;
//#endif
          }
          if (copy > _state.wnext) {
            copy -= _state.wnext;
            from = _state.wsize - copy;
          }
          else {
            from = _state.wnext - copy;
          }
          if (copy > _state.length) { copy = _state.length; }
          from_source = _state._window;
        }
        else {                              /* copy from output */
          from_source = output;
          from = put - _state.offset;
          copy = _state.length;
        }
        if (copy > left) { copy = left; }
        left -= copy;
        _state.length -= copy;
        do {
          output[put++] = from_source[from++];
        } while (--copy);
        if (_state.length === 0) { _state._mode = LEN; }
        break;
      case LIT:
        if (left === 0) { break inf_leave; }
        output[put++] = _state.length;
        left--;
        _state._mode = LEN;
        break;
      case CHECK:
        if (_state.wrap) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            // Use '|' instead of '+' to make sure that result is signed
            hold |= input[next++] << bits;
            bits += 8;
          }
          //===//
          _out -= left;
          _strm.total_out += _out;
          _state.total += _out;
          if (_out) {
            _strm.adler = _state.check =
                /*UPDATE(_state.check, put - _out, _out);*/
                (adler32(_state.check, output, _out, put - _out));

          }
          _out = left;
          // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
          if ((_state.flags ? hold : zswap32(hold)) !== _state.check) {
            _strm.msg = 'incorrect data check';
            _state._mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   check matches trailer\n"));
        }
        _state._mode = DONE;
        /* falls through */
      case DONE:
        ret = _Z_STREAM_END;
        break inf_leave;
      case BAD:
        ret = _Z_DATA_ERROR;
        break inf_leave;
      case MEM:
        return _Z_MEM_ERROR;
      case SYNC:
        /* falls through */
      default:
        return _Z_STREAM_ERROR;
    }
  }

  // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

  /*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call update_window() to create and/or update the _window _state.
     Note: a memory error from inflate() is non-recoverable.
   */

  //--- RESTORE() ---
  _strm._next_out = put;
  _strm._avail_out = left;
  _strm._next_in = next;
  _strm._avail_in = have;
  _state.hold = hold;
  _state.bits = bits;
  //---

  if (_state.wsize || (_out !== _strm._avail_out && _state._mode < BAD &&
                      (_state._mode < CHECK || flush !== _Z_FINISH))) {
    if (update_window(_strm, _strm.output, _strm._next_out, _out - _strm._avail_out)) {
      _state._mode = MEM;
      return _Z_MEM_ERROR;
    }
  }
  _in -= _strm._avail_in;
  _out -= _strm._avail_out;
  _strm.total_in += _in;
  _strm.total_out += _out;
  _state.total += _out;
  if (_state.wrap && _out) {
    _strm.adler = _state.check = /*UPDATE(_state.check, _strm._next_out - _out, _out);*/
      (adler32(_state.check, output, _out, _strm._next_out - _out));
  }
  _strm._data_type = _state.bits + (_state.last ? 64 : 0) +
                    (_state._mode === TYPE ? 128 : 0) +
                    (_state._mode === LEN_ || _state._mode === COPY_ ? 256 : 0);
  if (((_in === 0 && _out === 0) || flush === _Z_FINISH) && ret === _Z_OK) {
    ret = _Z_BUF_ERROR;
  }
  return ret;
}

function inflateEnd(_strm) {

  if (!_strm || !_strm._state /*|| _strm->zfree == (free_func)0*/) {
    return _Z_STREAM_ERROR;
  }

  var _state = _strm._state;
  if (_state._window) {
    _state._window = null;
  }
  _strm._state = null;
  return _Z_OK;
}

exports._inflateInit2 = inflateInit2;
exports._inflate = inflate;
exports._inflateEnd = inflateEnd;
exports._inflateInfo = 'pako inflate (from Nodeca project)';

/* Not implemented
exports.inflateCopy = inflateCopy;
exports.inflateGetDictionary = inflateGetDictionary;
exports.inflateMark = inflateMark;
exports.inflatePrime = inflatePrime;
exports.inflateSync = inflateSync;
exports.inflateSyncPoint = inflateSyncPoint;
exports.inflateUndermine = inflateUndermine;
*/
