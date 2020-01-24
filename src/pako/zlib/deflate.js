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

var utils   = require('../utils/common');
var trees   = require('./trees');
var adler32 = require('./adler32');

/* Public constants ==========================================================*/
/* ===========================================================================*/


/* Allowed flush values; see deflate() and inflate() below for details */
var _Z_NO_FLUSH      = 0;
var _Z_PARTIAL_FLUSH = 1;
//var _Z_SYNC_FLUSH    = 2;
var _Z_FULL_FLUSH    = 3;
var _Z_FINISH        = 4;
var _Z_BLOCK         = 5;
//var _Z_TREES         = 6;


/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
var _Z_OK            = 0;
var _Z_STREAM_END    = 1;
//var _Z_NEED_DICT     = 2;
//var _Z_ERRNO         = -1;
var _Z_STREAM_ERROR  = -2;
var _Z_DATA_ERROR    = -3;
//var _Z_MEM_ERROR     = -4;
var _Z_BUF_ERROR     = -5;
//var _Z_VERSION_ERROR = -6;


/* compression levels */
//var _Z_NO_COMPRESSION      = 0;
//var _Z_BEST_SPEED          = 1;
//var _Z_BEST_COMPRESSION    = 9;
var _Z_DEFAULT_COMPRESSION = -1;


var _Z_FILTERED            = 1;
var _Z_HUFFMAN_ONLY        = 2;
var _Z_RLE                 = 3;
var _Z_FIXED               = 4;
var _Z_DEFAULT_STRATEGY    = 0;

/* Possible values of the data_type field (though see inflate()) */
//var _Z_BINARY              = 0;
//var _Z_TEXT                = 1;
//var _Z_ASCII               = 1; // = _Z_TEXT
var _Z_UNKNOWN             = 2;


/* The deflate compression method */
var _Z_DEFLATED  = 8;

/*============================================================================*/


var MAX_MEM_LEVEL = 9;
/* Maximum value for memLevel in deflateInit2 */
var MAX_WBITS = 15;
/* 32K LZ77 _window */
var DEF_MEM_LEVEL = 8;


var LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */
var LITERALS      = 256;
/* number of literal bytes 0..255 */
var L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */
var D_CODES       = 30;
/* number of distance codes */
var BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */
var HEAP_SIZE     = 2 * L_CODES + 1;
/* maximum heap size */
var MAX_BITS  = 15;
/* All codes must not exceed MAX_BITS bits */

var MIN_MATCH = 3;
var MAX_MATCH = 258;
var MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

var PRESET_DICT = 0x20;

var INIT_STATE = 42;
var EXTRA_STATE = 69;
var NAME_STATE = 73;
var COMMENT_STATE = 91;
var HCRC_STATE = 103;
var BUSY_STATE = 113;
var FINISH_STATE = 666;

var BS_NEED_MORE      = 1; /* block not completed, need more input or more output */
var BS_BLOCK_DONE     = 2; /* block flush performed */
var BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
var BS_FINISH_DONE    = 4; /* finish done, accept no more input or output */

var OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

function err(_strm, errorCode) {
  _strm.msg = errorCode;
  return errorCode;
}

function rank(f) {
  return ((f) << 1) - ((f) > 4 ? 9 : 0);
}

function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }


/* =========================================================================
 * Flush as much pending output as possible. All deflate() output goes
 * through this function so some applications may wish to modify it
 * to avoid allocating a large _strm->output buffer and copying into it.
 * (See also read_buf()).
 */
function flush_pending(_strm) {
  var s = _strm._state;

  //_tr_flush_bits(s);
  var len = s.pending;
  if (len > _strm._avail_out) {
    len = _strm._avail_out;
  }
  if (len === 0) { return; }

  utils.arraySet(_strm.output, s._pending_buf, s.pending_out, len, _strm._next_out);
  _strm._next_out += len;
  s.pending_out += len;
  _strm.total_out += len;
  _strm._avail_out -= len;
  s.pending -= len;
  if (s.pending === 0) {
    s.pending_out = 0;
  }
}


function flush_block_only(s, last) {
  trees._tr_flush_block(s, (s._block_start >= 0 ? s._block_start : -1), s._strstart - s._block_start, last);
  s._block_start = s._strstart;
  flush_pending(s._strm);
}


function put_byte(s, b) {
  s._pending_buf[s.pending++] = b;
}


/* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream _state is correct and there is enough room in
 * _pending_buf.
 */
function putShortMSB(s, b) {
//  put_byte(s, (Byte)(b >> 8));
//  put_byte(s, (Byte)(b & 0xff));
  s._pending_buf[s.pending++] = (b >>> 8) & 0xff;
  s._pending_buf[s.pending++] = b & 0xff;
}


/* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large _strm->input buffer and copying from it.
 * (See also flush_pending()).
 */
function read_buf(_strm, buf, start, size) {
  var len = _strm._avail_in;

  if (len > size) { len = size; }
  if (len === 0) { return 0; }

  _strm._avail_in -= len;

  // zmemcpy(buf, _strm->_next_in, len);
  utils.arraySet(buf, _strm._input, _strm._next_in, len, start);
  if (_strm._state.wrap === 1) {
    _strm.adler = adler32(_strm.adler, buf, len, start);
  }

  _strm._next_in += len;
  _strm.total_in += len;

  return len;
}


/* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to _prev_length are discarded,
 * in which case the result is equal to _prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (_strstart) and its distance is <= MAX_DIST, and _prev_length >= 1
 * OUT assertion: the match length is not greater than s->_lookahead.
 */
function longest_match(s, cur_match) {
  var chain_length = s.max_chain_length;      /* max hash chain length */
  var scan = s._strstart; /* current string */
  var match;                       /* matched string */
  var len;                           /* length of current match */
  var best_len = s._prev_length;              /* best match length so far */
  var nice_match = s.nice_match;             /* stop if match long enough */
  var limit = (s._strstart > (s.w_size - MIN_LOOKAHEAD)) ?
      s._strstart - (s.w_size - MIN_LOOKAHEAD) : 0/*NIL*/;

  var _win = s._window; // shortcut

  var wmask = s.w_mask;
  var prev  = s.prev;

  /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of _window index 0.
   */

  var strend = s._strstart + MAX_MATCH;
  var scan_end1  = _win[scan + best_len - 1];
  var scan_end   = _win[scan + best_len];

  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */
  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

  /* Do not waste too much time if we already have a good match: */
  if (s._prev_length >= s.good_match) {
    chain_length >>= 2;
  }
  /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */
  if (nice_match > s._lookahead) { nice_match = s._lookahead; }

  // Assert((ulg)s->_strstart <= s->_window_size-MIN_LOOKAHEAD, "need _lookahead");

  do {
    // Assert(cur_match < s->_strstart, "no future");
    match = cur_match;

    /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient _lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the _lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */

    if (_win[match + best_len]     !== scan_end  ||
        _win[match + best_len - 1] !== scan_end1 ||
        _win[match]                !== _win[scan] ||
        _win[++match]              !== _win[scan + 1]) {
      continue;
    }

    /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */
    scan += 2;
    match++;
    // Assert(*scan == *match, "match[2]?");

    /* We check for insufficient _lookahead only every 8th comparison;
     * the 256th check will be made at _strstart+258.
     */
    do {
      /*jshint noempty:false*/
    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             scan < strend);

    // Assert(scan <= s->_window+(unsigned)(s->_window_size-1), "wild scan");

    len = MAX_MATCH - (strend - scan);
    scan = strend - MAX_MATCH;

    if (len > best_len) {
      s.match_start = cur_match;
      best_len = len;
      if (len >= nice_match) {
        break;
      }
      scan_end1  = _win[scan + best_len - 1];
      scan_end   = _win[scan + best_len];
    }
  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

  if (best_len <= s._lookahead) {
    return best_len;
  }
  return s._lookahead;
}


/* ===========================================================================
 * Fill the _window when the _lookahead becomes insufficient.
 * Updates _strstart and _lookahead.
 *
 * IN assertion: _lookahead < MIN_LOOKAHEAD
 * OUT assertions: _strstart <= _window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or _avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */
function fill__window(s) {
  var _w_size = s.w_size;
  var p, n, m, more, str;

  //Assert(s->_lookahead < MIN_LOOKAHEAD, "already enough _lookahead");

  do {
    more = s._window_size - s._lookahead - s._strstart;

    // JS ints have 32 bit, block below not needed
    /* Deal with !@#$% 64K limit: */
    //if (sizeof(int) <= 2) {
    //    if (more == 0 && s->_strstart == 0 && s->_lookahead == 0) {
    //        more = wsize;
    //
    //  } else if (more == (unsigned)(-1)) {
    //        /* Very unlikely, but possible on 16 bit machine if
    //         * _strstart == 0 && _lookahead == 1 (input done a byte at time)
    //         */
    //        more--;
    //    }
    //}


    /* If the _window is almost full and there is insufficient _lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */
    if (s._strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

      utils.arraySet(s._window, s._window, _w_size, _w_size, 0);
      s.match_start -= _w_size;
      s._strstart -= _w_size;
      /* we now have _strstart >= MAX_DIST */
      s._block_start -= _w_size;

      /* Slide the hash table (could be avoided with 32 bit values
       at the expense of memory usage). We slide even when level == 0
       to keep the hash table consistent if we switch back to level > 0
       later. (Using level 0 permanently is not an optimal usage of
       zlib, so we don't care about this pathological case.)
       */

      n = s.hash_size;
      p = n;
      do {
        m = s.head[--p];
        s.head[p] = (m >= _w_size ? m - _w_size : 0);
      } while (--n);

      n = _w_size;
      p = n;
      do {
        m = s.prev[--p];
        s.prev[p] = (m >= _w_size ? m - _w_size : 0);
        /* If n is not on any hash chain, prev[n] is garbage but
         * its value will never be used.
         */
      } while (--n);

      more += _w_size;
    }
    if (s._strm._avail_in === 0) {
      break;
    }

    /* If there was no sliding:
     *    _strstart <= WSIZE+MAX_DIST-1 && _lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == _window_size - _lookahead - _strstart
     * => more >= _window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= _window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   _window_size == input_size + MIN_LOOKAHEAD  &&
     *   _strstart + s->_lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, _window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */
    //Assert(more >= 2, "more < 2");
    n = read_buf(s._strm, s._window, s._strstart + s._lookahead, more);
    s._lookahead += n;

    /* Initialize the hash value now that we have some input: */
    if (s._lookahead + s.insert >= MIN_MATCH) {
      str = s._strstart - s.insert;
      s._ins_h = s._window[str];

      /* UPDATE_HASH(s, s->_ins_h, s->_window[str + 1]); */
      s._ins_h = ((s._ins_h << s.hash_shift) ^ s._window[str + 1]) & s.hash_mask;
//#if MIN_MATCH != 3
//        Call update_hash() MIN_MATCH-3 more times
//#endif
      while (s.insert) {
        /* UPDATE_HASH(s, s->_ins_h, s->_window[str + MIN_MATCH-1]); */
        s._ins_h = ((s._ins_h << s.hash_shift) ^ s._window[str + MIN_MATCH - 1]) & s.hash_mask;

        s.prev[str & s.w_mask] = s.head[s._ins_h];
        s.head[s._ins_h] = str;
        str++;
        s.insert--;
        if (s._lookahead + s.insert < MIN_MATCH) {
          break;
        }
      }
    }
    /* If the whole input has less than MIN_MATCH bytes, _ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */

  } while (s._lookahead < MIN_LOOKAHEAD && s._strm._avail_in !== 0);

  /* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to _strstart + MAX_MATCH, ignoring _lookahead.
   */
//  if (s.high_water < s._window_size) {
//    var curr = s._strstart + s._lookahead;
//    var init = 0;
//
//    if (s.high_water < curr) {
//      /* Previous high water mark below current data -- zero WIN_INIT
//       * bytes or up to end of _window, whichever is less.
//       */
//      init = s._window_size - curr;
//      if (init > WIN_INIT)
//        init = WIN_INIT;
//      zmemzero(s->_window + curr, (unsigned)init);
//      s->high_water = curr + init;
//    }
//    else if (s->high_water < (ulg)curr + WIN_INIT) {
//      /* High water mark at or above current data, but below current data
//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
//       * to end of _window, whichever is less.
//       */
//      init = (ulg)curr + WIN_INIT - s->high_water;
//      if (init > s->_window_size - s->high_water)
//        init = s->_window_size - s->high_water;
//      zmemzero(s->_window + s->high_water, (unsigned)init);
//      s->high_water += init;
//    }
//  }
//
//  Assert((ulg)s->_strstart <= s->_window_size - MIN_LOOKAHEAD,
//    "not enough room for search");
}

/* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block _state.
 * This function does not insert new strings in the dictionary since
 * uncompressible data is probably not useful. This function is used
 * only for the level=0 compression option.
 * NOTE: this function should be optimized to avoid extra copying from
 * _window to _pending_buf.
 */
function deflate_stored(s, flush) {
  /* Stored blocks are limited to 0xffff bytes, _pending_buf is limited
   * to _pending_buf_size, and each stored block has a 5 byte header:
   */
  var max_block_size = 0xffff;

  if (max_block_size > s._pending_buf_size - 5) {
    max_block_size = s._pending_buf_size - 5;
  }

  /* Copy as much as possible from input to output: */
  for (;;) {
    /* Fill the _window as much as possible: */
    if (s._lookahead <= 1) {

      //Assert(s->_strstart < s->w_size+MAX_DIST(s) ||
      //  s->_block_start >= (long)s->w_size, "slide too late");
//      if (!(s._strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
//        s._block_start >= s.w_size)) {
//        throw  new Error("slide too late");
//      }

      fill__window(s);
      if (s._lookahead === 0 && flush === _Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }

      if (s._lookahead === 0) {
        break;
      }
      /* flush the current block */
    }
    //Assert(s->_block_start >= 0L, "block gone");
//    if (s._block_start < 0) throw new Error("block gone");

    s._strstart += s._lookahead;
    s._lookahead = 0;

    /* Emit a stored block if _pending_buf will be full: */
    var max_start = s._block_start + max_block_size;

    if (s._strstart === 0 || s._strstart >= max_start) {
      /* _strstart == 0 is possible when wraparound on 16-bit machine */
      s._lookahead = s._strstart - max_start;
      s._strstart = max_start;
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s._strm._avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/


    }
    /* Flush if we may have to slide, otherwise _block_start may become
     * negative and the data will be gone:
     */
    if (s._strstart - s._block_start >= (s.w_size - MIN_LOOKAHEAD)) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s._strm._avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }

  s.insert = 0;

  if (flush === _Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s._strm._avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }

  if (s._strstart > s._block_start) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s._strm._avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_NEED_MORE;
}

/* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block _state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */
function deflate_fast(s, flush) {
  var hash_head;        /* head of the hash chain */
  var bflush;           /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we always have enough _lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s._lookahead < MIN_LOOKAHEAD) {
      fill__window(s);
      if (s._lookahead < MIN_LOOKAHEAD && flush === _Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s._lookahead === 0) {
        break; /* flush the current block */
      }
    }

    /* Insert the string _window[_strstart .. _strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s._lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s._strstart, hash_head); ***/
      s._ins_h = ((s._ins_h << s.hash_shift) ^ s._window[s._strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s._strstart & s.w_mask] = s.head[s._ins_h];
      s.head[s._ins_h] = s._strstart;
      /***/
    }

    /* Find the longest match, discarding those <= _prev_length.
     * At this point we have always _match_length < MIN_MATCH
     */
    if (hash_head !== 0/*NIL*/ && ((s._strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
      /* To simplify the code, we prevent matches with the string
       * of _window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s._match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */
    }
    if (s._match_length >= MIN_MATCH) {
      // check_match(s, s._strstart, s.match_start, s._match_length); // for debug only

      /*** _tr_tally_dist(s, s._strstart - s.match_start,
                     s._match_length - MIN_MATCH, bflush); ***/
      bflush = trees._tr_tally(s, s._strstart - s.match_start, s._match_length - MIN_MATCH);

      s._lookahead -= s._match_length;

      /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */
      if (s._match_length <= s.max_lazy_match/*max_insert_length*/ && s._lookahead >= MIN_MATCH) {
        s._match_length--; /* string at _strstart already in table */
        do {
          s._strstart++;
          /*** INSERT_STRING(s, s._strstart, hash_head); ***/
          s._ins_h = ((s._ins_h << s.hash_shift) ^ s._window[s._strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s._strstart & s.w_mask] = s.head[s._ins_h];
          s.head[s._ins_h] = s._strstart;
          /***/
          /* _strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */
        } while (--s._match_length !== 0);
        s._strstart++;
      } else
      {
        s._strstart += s._match_length;
        s._match_length = 0;
        s._ins_h = s._window[s._strstart];
        /* UPDATE_HASH(s, s._ins_h, s._window[s._strstart+1]); */
        s._ins_h = ((s._ins_h << s.hash_shift) ^ s._window[s._strstart + 1]) & s.hash_mask;

//#if MIN_MATCH != 3
//                Call UPDATE_HASH() MIN_MATCH-3 more times
//#endif
        /* If _lookahead < MIN_MATCH, _ins_h is garbage, but it does not
         * matter since it will be recomputed at next deflate call.
         */
      }
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s._window[s._strstart]));
      /*** _tr_tally_lit(s, s._window[s._strstart], bflush); ***/
      bflush = trees._tr_tally(s, 0, s._window[s._strstart]);

      s._lookahead--;
      s._strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s._strm._avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = ((s._strstart < (MIN_MATCH - 1)) ? s._strstart : MIN_MATCH - 1);
  if (flush === _Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s._strm._avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s._strm._avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next _window position.
 */
function deflate_slow(s, flush) {
  var hash_head;          /* head of hash chain */
  var bflush;              /* set if current block must be flushed */

  var max_insert;

  /* Process the input block. */
  for (;;) {
    /* Make sure that we always have enough _lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s._lookahead < MIN_LOOKAHEAD) {
      fill__window(s);
      if (s._lookahead < MIN_LOOKAHEAD && flush === _Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s._lookahead === 0) { break; } /* flush the current block */
    }

    /* Insert the string _window[_strstart .. _strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s._lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s._strstart, hash_head); ***/
      s._ins_h = ((s._ins_h << s.hash_shift) ^ s._window[s._strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s._strstart & s.w_mask] = s.head[s._ins_h];
      s.head[s._ins_h] = s._strstart;
      /***/
    }

    /* Find the longest match, discarding those <= _prev_length.
     */
    s._prev_length = s._match_length;
    s.prev_match = s.match_start;
    s._match_length = MIN_MATCH - 1;

    if (hash_head !== 0/*NIL*/ && s._prev_length < s.max_lazy_match &&
        s._strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/*MAX_DIST(s)*/) {
      /* To simplify the code, we prevent matches with the string
       * of _window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s._match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */

      if (s._match_length <= 5 &&
         (s.strategy === _Z_FILTERED || (s._match_length === MIN_MATCH && s._strstart - s.match_start > 4096/*TOO_FAR*/))) {

        /* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */
        s._match_length = MIN_MATCH - 1;
      }
    }
    /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */
    if (s._prev_length >= MIN_MATCH && s._match_length <= s._prev_length) {
      max_insert = s._strstart + s._lookahead - MIN_MATCH;
      /* Do not insert strings in hash table beyond this. */

      //check_match(s, s._strstart-1, s.prev_match, s._prev_length);

      /***_tr_tally_dist(s, s._strstart - 1 - s.prev_match,
                     s._prev_length - MIN_MATCH, bflush);***/
      bflush = trees._tr_tally(s, s._strstart - 1 - s.prev_match, s._prev_length - MIN_MATCH);
      /* Insert in hash table all strings up to the end of the match.
       * _strstart-1 and _strstart are already inserted. If there is not
       * enough _lookahead, the last two strings are not inserted in
       * the hash table.
       */
      s._lookahead -= s._prev_length - 1;
      s._prev_length -= 2;
      do {
        if (++s._strstart <= max_insert) {
          /*** INSERT_STRING(s, s._strstart, hash_head); ***/
          s._ins_h = ((s._ins_h << s.hash_shift) ^ s._window[s._strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s._strstart & s.w_mask] = s.head[s._ins_h];
          s.head[s._ins_h] = s._strstart;
          /***/
        }
      } while (--s._prev_length !== 0);
      s._match_available = 0;
      s._match_length = MIN_MATCH - 1;
      s._strstart++;

      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s._strm._avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }

    } else if (s._match_available) {
      /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */
      //Tracevv((stderr,"%c", s->_window[s->_strstart-1]));
      /*** _tr_tally_lit(s, s._window[s._strstart-1], bflush); ***/
      bflush = trees._tr_tally(s, 0, s._window[s._strstart - 1]);

      if (bflush) {
        /*** FLUSH_BLOCK_ONLY(s, 0) ***/
        flush_block_only(s, false);
        /***/
      }
      s._strstart++;
      s._lookahead--;
      if (s._strm._avail_out === 0) {
        return BS_NEED_MORE;
      }
    } else {
      /* There is no previous match to compare with, wait for
       * the next step to decide.
       */
      s._match_available = 1;
      s._strstart++;
      s._lookahead--;
    }
  }
  //Assert (flush != _Z_NO_FLUSH, "no flush?");
  if (s._match_available) {
    //Tracevv((stderr,"%c", s->_window[s->_strstart-1]));
    /*** _tr_tally_lit(s, s._window[s._strstart-1], bflush); ***/
    bflush = trees._tr_tally(s, 0, s._window[s._strstart - 1]);

    s._match_available = 0;
  }
  s.insert = s._strstart < MIN_MATCH - 1 ? s._strstart : MIN_MATCH - 1;
  if (flush === _Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s._strm._avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s._strm._avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_BLOCK_DONE;
}


/* ===========================================================================
 * For _Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from _Z_RLE.)
 */
function deflate_rle(s, flush) {
  var bflush;            /* set if current block must be flushed */
  var prev;              /* byte at distance one to match */
  var scan, strend;      /* scan goes up to strend for length of run */

  var _win = s._window;

  for (;;) {
    /* Make sure that we always have enough _lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */
    if (s._lookahead <= MAX_MATCH) {
      fill__window(s);
      if (s._lookahead <= MAX_MATCH && flush === _Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s._lookahead === 0) { break; } /* flush the current block */
    }

    /* See how many times the previous byte repeats */
    s._match_length = 0;
    if (s._lookahead >= MIN_MATCH && s._strstart > 0) {
      scan = s._strstart - 1;
      prev = _win[scan];
      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
        strend = s._strstart + MAX_MATCH;
        do {
          /*jshint noempty:false*/
        } while (prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 scan < strend);
        s._match_length = MAX_MATCH - (strend - scan);
        if (s._match_length > s._lookahead) {
          s._match_length = s._lookahead;
        }
      }
      //Assert(scan <= s->_window+(uInt)(s->_window_size-1), "wild scan");
    }

    /* Emit match if have run of MIN_MATCH or longer, else emit literal */
    if (s._match_length >= MIN_MATCH) {
      //check_match(s, s._strstart, s._strstart - 1, s._match_length);

      /*** _tr_tally_dist(s, 1, s._match_length - MIN_MATCH, bflush); ***/
      bflush = trees._tr_tally(s, 1, s._match_length - MIN_MATCH);

      s._lookahead -= s._match_length;
      s._strstart += s._match_length;
      s._match_length = 0;
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s->_window[s->_strstart]));
      /*** _tr_tally_lit(s, s._window[s._strstart], bflush); ***/
      bflush = trees._tr_tally(s, 0, s._window[s._strstart]);

      s._lookahead--;
      s._strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s._strm._avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === _Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s._strm._avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s._strm._avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* ===========================================================================
 * For _Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */
function deflate_huff(s, flush) {
  var bflush;             /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we have a literal to write. */
    if (s._lookahead === 0) {
      fill__window(s);
      if (s._lookahead === 0) {
        if (flush === _Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        break;      /* flush the current block */
      }
    }

    /* Output a literal byte */
    s._match_length = 0;
    //Tracevv((stderr,"%c", s->_window[s->_strstart]));
    /*** _tr_tally_lit(s, s._window[s._strstart], bflush); ***/
    bflush = trees._tr_tally(s, 0, s._window[s._strstart]);
    s._lookahead--;
    s._strstart++;
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s._strm._avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === _Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s._strm._avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s._strm._avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */
function Config(good_length, max_lazy, nice_length, max_chain, func) {
  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
}

var configuration_table;

configuration_table = [
  /*      good lazy nice chain */
  new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
  new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
  new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
  new Config(4, 6, 32, 32, deflate_fast),          /* 3 */

  new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
  new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
  new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
  new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
  new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
  new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
];


/* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */
function lm_init(s) {
  s._window_size = 2 * s.w_size;

  /*** CLEAR_HASH(s); ***/
  zero(s.head); // Fill with NIL (= 0);

  /* Set the default configuration parameters:
   */
  s.max_lazy_match = configuration_table[s.level].max_lazy;
  s.good_match = configuration_table[s.level].good_length;
  s.nice_match = configuration_table[s.level].nice_length;
  s.max_chain_length = configuration_table[s.level].max_chain;

  s._strstart = 0;
  s._block_start = 0;
  s._lookahead = 0;
  s.insert = 0;
  s._match_length = s._prev_length = MIN_MATCH - 1;
  s._match_available = 0;
  s._ins_h = 0;
}


function DeflateState() {
  this._strm = null;            /* pointer back to this zlib stream */
  this.status = 0;            /* as the name implies */
  this._pending_buf = null;      /* output still pending */
  this._pending_buf_size = 0;  /* size of _pending_buf */
  this.pending_out = 0;       /* next pending byte to output to the stream */
  this.pending = 0;           /* nb of bytes in the pending buffer */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.method = _Z_DEFLATED; /* can only be DEFLATED */
  this._last_flush = -1;   /* value of flush param for previous deflate call */

  this.w_size = 0;  /* LZ77 _window size (32K by default) */
  this.w_bits = 0;  /* log2(w_size)  (8..16) */
  this.w_mask = 0;  /* w_size - 1 */

  this._window = null;
  /* Sliding _window. Input bytes are read into the second half of the _window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */

  this._window_size = 0;
  /* Actual size of _window: 2*wSize, except when the user input buffer
   * is directly used as sliding _window.
   */

  this.prev = null;
  /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a _window index modulo 32K.
   */

  this.head = null;   /* Heads of the hash chains or NIL. */

  this._ins_h = 0;       /* hash index of string to be inserted */
  this.hash_size = 0;   /* number of elements in hash table */
  this.hash_bits = 0;   /* log2(hash_size) */
  this.hash_mask = 0;   /* hash_size-1 */

  this.hash_shift = 0;
  /* Number of bits by which _ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */

  this._block_start = 0;
  /* _window position at the beginning of the current output block. Gets
   * negative when the _window is moved backwards.
   */

  this._match_length = 0;      /* length of best match */
  this.prev_match = 0;        /* previous match */
  this._match_available = 0;   /* set if previous match exists */
  this._strstart = 0;          /* start of string to insert */
  this.match_start = 0;       /* start of matching string */
  this._lookahead = 0;         /* number of valid bytes ahead in _window */

  this._prev_length = 0;
  /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */

  this.max_chain_length = 0;
  /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */

  this.max_lazy_match = 0;
  /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */
  // That's alias to max_lazy_match, don't use directly
  //this.max_insert_length = 0;
  /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */

  this.level = 0;     /* compression level (1..9) */
  this.strategy = 0;  /* favor or force Huffman coding*/

  this.good_match = 0;
  /* Use a faster search when the previous match is longer than this */

  this.nice_match = 0; /* Stop searching when current match exceeds this */

              /* used by trees.c: */

  /* Didn't use ct_data typedef below to suppress compiler warning */

  // struct ct_data_s _dyn_ltree[HEAP_SIZE];   /* literal and length tree */
  // struct ct_data_s _dyn_dtree[2*D_CODES+1]; /* distance tree */
  // struct ct_data_s _bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

  // Use flat array of DOUBLE size, with interleaved fata,
  // because JS does not support effective
  this._dyn_ltree  = new utils.Buf16(HEAP_SIZE * 2);
  this._dyn_dtree  = new utils.Buf16((2 * D_CODES + 1) * 2);
  this._bl_tree    = new utils.Buf16((2 * BL_CODES + 1) * 2);
  zero(this._dyn_ltree);
  zero(this._dyn_dtree);
  zero(this._bl_tree);

  this.l_desc   = null;         /* desc. for literal tree */
  this.d_desc   = null;         /* desc. for distance tree */
  this.bl_desc  = null;         /* desc. for bit length tree */

  //ush bl_count[MAX_BITS+1];
  this.bl_count = new utils.Buf16(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
  this.heap = new utils.Buf16(2 * L_CODES + 1);  /* heap used to build the Huffman trees */
  zero(this.heap);

  this.heap_len = 0;               /* number of elements in the heap */
  this.heap_max = 0;               /* element of largest frequency */
  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */

  this.depth = new utils.Buf16(2 * L_CODES + 1); //uch depth[2*L_CODES+1];
  zero(this.depth);
  /* Depth of each subtree used as tie breaker for trees of equal frequency
   */

  this.l_buf = 0;          /* buffer index for literals or lengths */

  this.lit_bufsize = 0;
  /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the _window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */

  this.last_lit = 0;      /* running index in l_buf */

  this.d_buf = 0;
  /* Buffer index for distances. To simplify the code, d_buf and l_buf have
   * the same number of elements. To use different lengths, an extra flag
   * array would be necessary.
   */

  this.opt_len = 0;       /* bit length of current block with optimal trees */
  this.static_len = 0;    /* bit length of current block with static trees */
  this.matches = 0;       /* number of string matches in current block */
  this.insert = 0;        /* bytes at end of _window left to insert */


  this.bi_buf = 0;
  /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */
  this._bi_valid = 0;
  /* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */

  // Used for _window memory init. We safely ignore it for JS. That makes
  // sense only for pointers and memory check tools.
  //this.high_water = 0;
  /* High water mark offset in _window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */
}


function deflateResetKeep(_strm) {
  var s;

  if (!_strm || !_strm._state) {
    return err(_strm, _Z_STREAM_ERROR);
  }

  _strm.total_in = _strm.total_out = 0;
  _strm._data_type = _Z_UNKNOWN;

  s = _strm._state;
  s.pending = 0;
  s.pending_out = 0;

  if (s.wrap < 0) {
    s.wrap = -s.wrap;
    /* was made negative by deflate(..., _Z_FINISH); */
  }
  s.status = (s.wrap ? INIT_STATE : BUSY_STATE);
  _strm.adler = (s.wrap === 2) ?
    0  // crc32(0, Z_NULL, 0)
  :
    1; // adler32(0, Z_NULL, 0)
  s._last_flush = _Z_NO_FLUSH;
  trees._tr_init(s);
  return _Z_OK;
}


function deflateReset(_strm) {
  var ret = deflateResetKeep(_strm);
  if (ret === _Z_OK) {
    lm_init(_strm._state);
  }
  return ret;
}


function deflateInit2(_strm, level, method, _windowBits, memLevel, strategy) {
  if (!_strm) { // === Z_NULL
    return _Z_STREAM_ERROR;
  }
  var wrap = 1;

  if (level === _Z_DEFAULT_COMPRESSION) {
    level = 6;
  }

  if (_windowBits < 0) { /* suppress zlib wrapper */
    wrap = 0;
    _windowBits = -_windowBits;
  }

  else if (_windowBits > 15) {
    wrap = 2;           /* write gzip wrapper instead */
    _windowBits -= 16;
  }


  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== _Z_DEFLATED ||
    _windowBits < 8 || _windowBits > 15 || level < 0 || level > 9 ||
    strategy < 0 || strategy > _Z_FIXED) {
    return err(_strm, _Z_STREAM_ERROR);
  }


  if (_windowBits === 8) {
    _windowBits = 9;
  }
  /* until 256-byte _window bug fixed */

  var s = new DeflateState();

  _strm._state = s;
  s._strm = _strm;

  s.wrap = wrap;
  s.gzhead = null;
  s.w_bits = _windowBits;
  s.w_size = 1 << s.w_bits;
  s.w_mask = s.w_size - 1;

  s.hash_bits = memLevel + 7;
  s.hash_size = 1 << s.hash_bits;
  s.hash_mask = s.hash_size - 1;
  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);

  s._window = new utils.Buf8(s.w_size * 2);
  s.head = new utils.Buf16(s.hash_size);
  s.prev = new utils.Buf16(s.w_size);

  // Don't need mem init magic for JS.
  //s.high_water = 0;  /* nothing written to s->_window yet */

  s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */

  s._pending_buf_size = s.lit_bufsize * 4;

  //overlay = (ushf *) ZALLOC(_strm, s->lit_bufsize, sizeof(ush)+2);
  //s->_pending_buf = (uchf *) overlay;
  s._pending_buf = new utils.Buf8(s._pending_buf_size);

  // It is offset from `s._pending_buf` (size is `s.lit_bufsize * 2`)
  //s->d_buf = overlay + s->lit_bufsize/sizeof(ush);
  s.d_buf = 1 * s.lit_bufsize;

  //s->l_buf = s->_pending_buf + (1+sizeof(ush))*s->lit_bufsize;
  s.l_buf = (1 + 2) * s.lit_bufsize;

  s.level = level;
  s.strategy = strategy;
  s.method = method;

  return deflateReset(_strm);
}


function deflate(_strm, flush) {
  var old_flush, s;
  var beg, val; // for gzip header write only

  if (!_strm || !_strm._state ||
    flush > _Z_BLOCK || flush < 0) {
    return _strm ? err(_strm, _Z_STREAM_ERROR) : _Z_STREAM_ERROR;
  }

  s = _strm._state;

  if (!_strm.output ||
      (!_strm._input && _strm._avail_in !== 0) ||
      (s.status === FINISH_STATE && flush !== _Z_FINISH)) {
    return err(_strm, (_strm._avail_out === 0) ? _Z_BUF_ERROR : _Z_STREAM_ERROR);
  }

  s._strm = _strm; /* just in case */
  old_flush = s._last_flush;
  s._last_flush = flush;

  /* Write the header */
  if (s.status === INIT_STATE) {
    {
      var header = (_Z_DEFLATED + ((s.w_bits - 8) << 4)) << 8;
      var level_flags = -1;

      if (s.strategy >= _Z_HUFFMAN_ONLY || s.level < 2) {
        level_flags = 0;
      } else if (s.level < 6) {
        level_flags = 1;
      } else if (s.level === 6) {
        level_flags = 2;
      } else {
        level_flags = 3;
      }
      header |= (level_flags << 6);
      if (s._strstart !== 0) { header |= PRESET_DICT; }
      header += 31 - (header % 31);

      s.status = BUSY_STATE;
      putShortMSB(s, header);

      /* Save the adler32 of the preset dictionary: */
      if (s._strstart !== 0) {
        putShortMSB(s, _strm.adler >>> 16);
        putShortMSB(s, _strm.adler & 0xffff);
      }
      _strm.adler = 1; // adler32(0L, Z_NULL, 0);
    }
  }


  /* Flush as much pending output as possible */
  if (s.pending !== 0) {
    flush_pending(_strm);
    if (_strm._avail_out === 0) {
      /* Since _avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * _avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */
      s._last_flush = -1;
      return _Z_OK;
    }

    /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with _Z_FINISH, we keep
     * returning _Z_STREAM_END instead of _Z_BUF_ERROR.
     */
  } else if (_strm._avail_in === 0 && rank(flush) <= rank(old_flush) &&
    flush !== _Z_FINISH) {
    return err(_strm, _Z_BUF_ERROR);
  }

  /* User must not provide more input after the first FINISH: */
  if (s.status === FINISH_STATE && _strm._avail_in !== 0) {
    return err(_strm, _Z_BUF_ERROR);
  }

  /* Start a new block or continue the current one.
   */
  if (_strm._avail_in !== 0 || s._lookahead !== 0 ||
    (flush !== _Z_NO_FLUSH && s.status !== FINISH_STATE)) {
    var bstate = (s.strategy === _Z_HUFFMAN_ONLY) ? deflate_huff(s, flush) :
      (s.strategy === _Z_RLE ? deflate_rle(s, flush) :
        configuration_table[s.level].func(s, flush));

    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
      s.status = FINISH_STATE;
    }
    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
      if (_strm._avail_out === 0) {
        s._last_flush = -1;
        /* avoid BUF_ERROR next call, see above */
      }
      return _Z_OK;
      /* If flush != _Z_NO_FLUSH && _avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */
    }
    if (bstate === BS_BLOCK_DONE) {
      if (flush === _Z_PARTIAL_FLUSH) {
        trees._tr_align(s);
      }
      else if (flush !== _Z_BLOCK) { /* FULL_FLUSH or SYNC_FLUSH */

        trees._tr_stored_block(s, 0, 0, false);
        /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */
        if (flush === _Z_FULL_FLUSH) {
          /*** CLEAR_HASH(s); ***/             /* forget history */
          zero(s.head); // Fill with NIL (= 0);

          if (s._lookahead === 0) {
            s._strstart = 0;
            s._block_start = 0;
            s.insert = 0;
          }
        }
      }
      flush_pending(_strm);
      if (_strm._avail_out === 0) {
        s._last_flush = -1; /* avoid BUF_ERROR at next call, see above */
        return _Z_OK;
      }
    }
  }
  //Assert(_strm->_avail_out > 0, "bug2");
  //if (_strm._avail_out <= 0) { throw new Error("bug2");}

  if (flush !== _Z_FINISH) { return _Z_OK; }
  if (s.wrap <= 0) { return _Z_STREAM_END; }

  /* Write the trailer */
  if (s.wrap === 2) {
    put_byte(s, _strm.adler & 0xff);
    put_byte(s, (_strm.adler >> 8) & 0xff);
    put_byte(s, (_strm.adler >> 16) & 0xff);
    put_byte(s, (_strm.adler >> 24) & 0xff);
    put_byte(s, _strm.total_in & 0xff);
    put_byte(s, (_strm.total_in >> 8) & 0xff);
    put_byte(s, (_strm.total_in >> 16) & 0xff);
    put_byte(s, (_strm.total_in >> 24) & 0xff);
  }
  else
  {
    putShortMSB(s, _strm.adler >>> 16);
    putShortMSB(s, _strm.adler & 0xffff);
  }

  flush_pending(_strm);
  /* If _avail_out is zero, the application will call deflate again
   * to flush the rest.
   */
  if (s.wrap > 0) { s.wrap = -s.wrap; }
  /* write the trailer only once! */
  return s.pending !== 0 ? _Z_OK : _Z_STREAM_END;
}

function deflateEnd(_strm) {
  var status;

  if (!_strm/*== Z_NULL*/ || !_strm._state/*== Z_NULL*/) {
    return _Z_STREAM_ERROR;
  }

  status = _strm._state.status;
  if (status !== INIT_STATE &&
    status !== EXTRA_STATE &&
    status !== NAME_STATE &&
    status !== COMMENT_STATE &&
    status !== HCRC_STATE &&
    status !== BUSY_STATE &&
    status !== FINISH_STATE
  ) {
    return err(_strm, _Z_STREAM_ERROR);
  }

  _strm._state = null;

  return status === BUSY_STATE ? err(_strm, _Z_DATA_ERROR) : _Z_OK;
}


exports._deflateInit2 = deflateInit2;
exports._deflate = deflate;
exports._deflateEnd = deflateEnd;
exports._deflateInfo = 'pako deflate (from Nodeca project)';

/* Not implemented
exports.deflateBound = deflateBound;
exports.deflateCopy = deflateCopy;
exports.deflateParams = deflateParams;
exports.deflatePending = deflatePending;
exports.deflatePrime = deflatePrime;
exports.deflateTune = deflateTune;
*/
