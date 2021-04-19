module.exports = (function() {
    function int_pos(i) {
        return i >= 0n ? i : 0n;
    };

    function int_neg(i) {
        return i < 0n ? -i : 0n;
    };

    function word_to_u16(w) {
        var u = 0;
        for (var i = 0; i < 16; ++i) {
            u = u | (w._ === 'Word.i' ? 1 << i : 0);
            w = w.pred;
        };
        return u;
    };

    function u16_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 16; ++i) {
            w = {
                _: (u >>> (16 - i - 1)) & 1 ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function u16_to_bits(x) {
        var s = '';
        for (var i = 0; i < 16; ++i) {
            s = (x & 1 ? '1' : '0') + s;
            x = x >>> 1;
        }
        return s;
    };

    function word_to_u32(w) {
        var u = 0;
        for (var i = 0; i < 32; ++i) {
            u = u | (w._ === 'Word.i' ? 1 << i : 0);
            w = w.pred;
        };
        return u;
    };

    function u32_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 32; ++i) {
            w = {
                _: (u >>> (32 - i - 1)) & 1 ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function u32_for(state, from, til, func) {
        for (var i = from; i < til; ++i) {
            state = func(i)(state);
        }
        return state;
    };

    function word_to_u64(w) {
        var u = 0n;
        for (var i = 0n; i < 64n; i += 1n) {
            u = u | (w._ === 'Word.i' ? 1n << i : 0n);
            w = w.pred;
        };
        return u;
    };

    function u64_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0n; i < 64n; i += 1n) {
            w = {
                _: (u >> (64n - i - 1n)) & 1n ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function u32array_to_buffer32(a) {
        function go(a, buffer) {
            switch (a._) {
                case 'Array.tip':
                    buffer.push(a.value);
                    break;
                case 'Array.tie':
                    go(a.lft, buffer);
                    go(a.rgt, buffer);
                    break;
            }
            return buffer;
        };
        return new Uint32Array(go(a, []));
    };

    function buffer32_to_u32array(b) {
        function go(b) {
            if (b.length === 1) {
                return {
                    _: 'Array.tip',
                    value: b[0]
                };
            } else {
                var lft = go(b.slice(0, b.length / 2));
                var rgt = go(b.slice(b.length / 2));
                return {
                    _: 'Array.tie',
                    lft,
                    rgt
                };
            };
        };
        return go(b);
    };

    function buffer32_to_depth(b) {
        return BigInt(Math.log(b.length) / Math.log(2));
    };
    var list_for = list => nil => cons => {
        while (list._ !== 'List.nil') {
            nil = cons(list.head)(nil);
            list = list.tail;
        }
        return nil;
    };
    const inst_unit = x => x(null);
    const elim_unit = (x => {
        var $1 = (() => c0 => {
            var self = x;
            switch ("unit") {
                case 'unit':
                    var $0 = c0;
                    return $0;
            };
        })();
        return $1;
    });
    const inst_bool = x => x(true)(false);
    const elim_bool = (x => {
        var $4 = (() => c0 => c1 => {
            var self = x;
            if (self) {
                var $2 = c2;
                return $2;
            } else {
                var $3 = c2;
                return $3;
            };
        })();
        return $4;
    });
    const inst_nat = x => x(0n)(x0 => 1n + x0);
    const elim_nat = (x => {
        var $8 = (() => c0 => c1 => {
            var self = x;
            if (self === 0n) {
                var $5 = c2;
                return $5;
            } else {
                var $6 = (self - 1n);
                var $7 = c2($6);
                return $7;
            };
        })();
        return $8;
    });
    const inst_int = x => x(x0 => x1 => x0 - x1);
    const elim_int = (x => {
        var $12 = (() => c0 => {
            var self = x;
            switch ("new") {
                case 'new':
                    var $9 = int_pos(self);
                    var $10 = int_neg(self);
                    var $11 = c0($9)($10);
                    return $11;
            };
        })();
        return $12;
    });
    const inst_bits = x => x('')(x0 => x0 + '0')(x0 => x0 + '1');
    const elim_bits = (x => {
        var $18 = (() => c0 => c1 => c2 => {
            var self = x;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $13 = self.slice(0, -1);
                    var $14 = c1($13);
                    return $14;
                case 'i':
                    var $15 = self.slice(0, -1);
                    var $16 = c2($15);
                    return $16;
                case 'e':
                    var $17 = c0;
                    return $17;
            };
        })();
        return $18;
    });
    const inst_u16 = x => x(x0 => word_to_u16(x0));
    const elim_u16 = (x => {
        var $21 = (() => c0 => {
            var self = x;
            switch ('u16') {
                case 'u16':
                    var $19 = u16_to_word(self);
                    var $20 = c0($19);
                    return $20;
            };
        })();
        return $21;
    });
    const inst_u32 = x => x(x0 => word_to_u32(x0));
    const elim_u32 = (x => {
        var $24 = (() => c0 => {
            var self = x;
            switch ('u32') {
                case 'u32':
                    var $22 = u32_to_word(self);
                    var $23 = c0($22);
                    return $23;
            };
        })();
        return $24;
    });
    const inst_u64 = x => x(x0 => word_to_u64(x0));
    const elim_u64 = (x => {
        var $27 = (() => c0 => {
            var self = x;
            switch ('u64') {
                case 'u64':
                    var $25 = u64_to_word(self);
                    var $26 = c0($25);
                    return $26;
            };
        })();
        return $27;
    });
    const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    const elim_string = (x => {
        var $32 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $28 = c2;
                return $28;
            } else {
                var $29 = self.charCodeAt(0);
                var $30 = self.slice(1);
                var $31 = c2($29)($30);
                return $31;
            };
        })();
        return $32;
    });
    const inst_buffer32 = x => x(x0 => x1 => u32array_to_buffer32(x1));
    const elim_buffer32 = (x => {
        var $36 = (() => c0 => {
            var self = x;
            switch ('b32') {
                case 'b32':
                    var $33 = buffer32_to_depth(self);
                    var $34 = buffer32_to_u32array(self);
                    var $35 = c0($33)($34);
                    return $35;
            };
        })();
        return $36;
    });

    function Buffer32$new$(_depth$1, _array$2) {
        var $37 = u32array_to_buffer32(_array$2);
        return $37;
    };
    const Buffer32$new = x0 => x1 => Buffer32$new$(x0, x1);

    function Array$(_A$1, _depth$2) {
        var $38 = null;
        return $38;
    };
    const Array = x0 => x1 => Array$(x0, x1);

    function Array$tip$(_value$2) {
        var $39 = ({
            _: 'Array.tip',
            'value': _value$2
        });
        return $39;
    };
    const Array$tip = x0 => Array$tip$(x0);

    function Array$tie$(_lft$3, _rgt$4) {
        var $40 = ({
            _: 'Array.tie',
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $40;
    };
    const Array$tie = x0 => x1 => Array$tie$(x0, x1);

    function Array$alloc$(_depth$2, _x$3) {
        var self = _depth$2;
        if (self === 0n) {
            var $42 = Array$tip$(_x$3);
            var $41 = $42;
        } else {
            var $43 = (self - 1n);
            var _half$5 = Array$alloc$($43, _x$3);
            var $44 = Array$tie$(_half$5, _half$5);
            var $41 = $44;
        };
        return $41;
    };
    const Array$alloc = x0 => x1 => Array$alloc$(x0, x1);

    function U32$new$(_value$1) {
        var $45 = word_to_u32(_value$1);
        return $45;
    };
    const U32$new = x0 => U32$new$(x0);

    function Word$(_size$1) {
        var $46 = null;
        return $46;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$o$(_pred$2) {
        var $47 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $47;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $49 = Word$e;
            var $48 = $49;
        } else {
            var $50 = (self - 1n);
            var $51 = Word$o$(Word$zero$($50));
            var $48 = $51;
        };
        return $48;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$succ$(_pred$1) {
        var $52 = 1n + _pred$1;
        return $52;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U32$zero = U32$new$(Word$zero$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$zero))))))))))))))))))))))))))))))))));
    const Buffer32$alloc = a0 => (new Uint32Array(2 ** Number(a0)));

    function Word$bit_length$go$(_word$2, _c$3, _n$4) {
        var Word$bit_length$go$ = (_word$2, _c$3, _n$4) => ({
            ctr: 'TCO',
            arg: [_word$2, _c$3, _n$4]
        });
        var Word$bit_length$go = _word$2 => _c$3 => _n$4 => Word$bit_length$go$(_word$2, _c$3, _n$4);
        var arg = [_word$2, _c$3, _n$4];
        while (true) {
            let [_word$2, _c$3, _n$4] = arg;
            var R = (() => {
                var self = _word$2;
                switch (self._) {
                    case 'Word.o':
                        var $53 = self.pred;
                        var $54 = Word$bit_length$go$($53, Nat$succ$(_c$3), _n$4);
                        return $54;
                    case 'Word.i':
                        var $55 = self.pred;
                        var $56 = Word$bit_length$go$($55, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $56;
                    case 'Word.e':
                        var $57 = _n$4;
                        return $57;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $58 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $58;
    };
    const Word$bit_length = x0 => Word$bit_length$(x0);

    function U32$bit_length$(_size$1) {
        var self = _size$1;
        switch ('u32') {
            case 'u32':
                var $60 = u32_to_word(self);
                var $61 = Word$bit_length$($60);
                var $59 = $61;
                break;
        };
        return $59;
    };
    const U32$bit_length = x0 => U32$bit_length$(x0);

    function Word$i$(_pred$2) {
        var $62 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $62;
    };
    const Word$i = x0 => Word$i$(x0);
    const Bool$false = false;
    const Bool$true = true;

    function Word$shift_left1$aux$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $64 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $66 = Word$i$(Word$shift_left1$aux$($64, Bool$false));
                    var $65 = $66;
                } else {
                    var $67 = Word$o$(Word$shift_left1$aux$($64, Bool$false));
                    var $65 = $67;
                };
                var $63 = $65;
                break;
            case 'Word.i':
                var $68 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $70 = Word$i$(Word$shift_left1$aux$($68, Bool$true));
                    var $69 = $70;
                } else {
                    var $71 = Word$o$(Word$shift_left1$aux$($68, Bool$true));
                    var $69 = $71;
                };
                var $63 = $69;
                break;
            case 'Word.e':
                var $72 = Word$e;
                var $63 = $72;
                break;
        };
        return $63;
    };
    const Word$shift_left1$aux = x0 => x1 => Word$shift_left1$aux$(x0, x1);

    function Word$shift_left1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $74 = self.pred;
                var $75 = Word$o$(Word$shift_left1$aux$($74, Bool$false));
                var $73 = $75;
                break;
            case 'Word.i':
                var $76 = self.pred;
                var $77 = Word$o$(Word$shift_left1$aux$($76, Bool$true));
                var $73 = $77;
                break;
            case 'Word.e':
                var $78 = Word$e;
                var $73 = $78;
                break;
        };
        return $73;
    };
    const Word$shift_left1 = x0 => Word$shift_left1$(x0);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $80 = self.pred;
                var $81 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $83 = self.pred;
                            var $84 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $86 = Word$i$(Word$adder$(_a$pred$10, $83, Bool$false));
                                    var $85 = $86;
                                } else {
                                    var $87 = Word$o$(Word$adder$(_a$pred$10, $83, Bool$false));
                                    var $85 = $87;
                                };
                                return $85;
                            });
                            var $82 = $84;
                            break;
                        case 'Word.i':
                            var $88 = self.pred;
                            var $89 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $91 = Word$o$(Word$adder$(_a$pred$10, $88, Bool$true));
                                    var $90 = $91;
                                } else {
                                    var $92 = Word$i$(Word$adder$(_a$pred$10, $88, Bool$false));
                                    var $90 = $92;
                                };
                                return $90;
                            });
                            var $82 = $89;
                            break;
                        case 'Word.e':
                            var $93 = (_a$pred$8 => {
                                var $94 = Word$e;
                                return $94;
                            });
                            var $82 = $93;
                            break;
                    };
                    var $82 = $82($80);
                    return $82;
                });
                var $79 = $81;
                break;
            case 'Word.i':
                var $95 = self.pred;
                var $96 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $98 = self.pred;
                            var $99 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $101 = Word$o$(Word$adder$(_a$pred$10, $98, Bool$true));
                                    var $100 = $101;
                                } else {
                                    var $102 = Word$i$(Word$adder$(_a$pred$10, $98, Bool$false));
                                    var $100 = $102;
                                };
                                return $100;
                            });
                            var $97 = $99;
                            break;
                        case 'Word.i':
                            var $103 = self.pred;
                            var $104 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $106 = Word$i$(Word$adder$(_a$pred$10, $103, Bool$true));
                                    var $105 = $106;
                                } else {
                                    var $107 = Word$o$(Word$adder$(_a$pred$10, $103, Bool$true));
                                    var $105 = $107;
                                };
                                return $105;
                            });
                            var $97 = $104;
                            break;
                        case 'Word.e':
                            var $108 = (_a$pred$8 => {
                                var $109 = Word$e;
                                return $109;
                            });
                            var $97 = $108;
                            break;
                    };
                    var $97 = $97($95);
                    return $97;
                });
                var $79 = $96;
                break;
            case 'Word.e':
                var $110 = (_b$5 => {
                    var $111 = Word$e;
                    return $111;
                });
                var $79 = $110;
                break;
        };
        var $79 = $79(_b$3);
        return $79;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $112 = Word$adder$(_a$2, _b$3, Bool$false);
        return $112;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);

    function Word$mul$go$(_a$3, _b$4, _acc$5) {
        var Word$mul$go$ = (_a$3, _b$4, _acc$5) => ({
            ctr: 'TCO',
            arg: [_a$3, _b$4, _acc$5]
        });
        var Word$mul$go = _a$3 => _b$4 => _acc$5 => Word$mul$go$(_a$3, _b$4, _acc$5);
        var arg = [_a$3, _b$4, _acc$5];
        while (true) {
            let [_a$3, _b$4, _acc$5] = arg;
            var R = (() => {
                var self = _a$3;
                switch (self._) {
                    case 'Word.o':
                        var $113 = self.pred;
                        var $114 = Word$mul$go$($113, Word$shift_left1$(_b$4), _acc$5);
                        return $114;
                    case 'Word.i':
                        var $115 = self.pred;
                        var $116 = Word$mul$go$($115, Word$shift_left1$(_b$4), Word$add$(_b$4, _acc$5));
                        return $116;
                    case 'Word.e':
                        var $117 = _acc$5;
                        return $117;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$mul$go = x0 => x1 => x2 => Word$mul$go$(x0, x1, x2);

    function Word$to_zero$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $119 = self.pred;
                var $120 = Word$o$(Word$to_zero$($119));
                var $118 = $120;
                break;
            case 'Word.i':
                var $121 = self.pred;
                var $122 = Word$o$(Word$to_zero$($121));
                var $118 = $122;
                break;
            case 'Word.e':
                var $123 = Word$e;
                var $118 = $123;
                break;
        };
        return $118;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $124 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $124;
    };
    const Word$mul = x0 => x1 => Word$mul$(x0, x1);
    const U32$mul = a0 => a1 => ((a0 * a1) >>> 0);

    function Nat$apply$(_n$2, _f$3, _x$4) {
        var Nat$apply$ = (_n$2, _f$3, _x$4) => ({
            ctr: 'TCO',
            arg: [_n$2, _f$3, _x$4]
        });
        var Nat$apply = _n$2 => _f$3 => _x$4 => Nat$apply$(_n$2, _f$3, _x$4);
        var arg = [_n$2, _f$3, _x$4];
        while (true) {
            let [_n$2, _f$3, _x$4] = arg;
            var R = (() => {
                var self = _n$2;
                if (self === 0n) {
                    var $125 = _x$4;
                    return $125;
                } else {
                    var $126 = (self - 1n);
                    var $127 = Nat$apply$($126, _f$3, _f$3(_x$4));
                    return $127;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $129 = self.pred;
                var $130 = Word$i$($129);
                var $128 = $130;
                break;
            case 'Word.i':
                var $131 = self.pred;
                var $132 = Word$o$(Word$inc$($131));
                var $128 = $132;
                break;
            case 'Word.e':
                var $133 = Word$e;
                var $128 = $133;
                break;
        };
        return $128;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $134 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $134;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);

    function VoxBox$new$(_length$1, _capacity$2, _buffer$3) {
        var $135 = ({
            _: 'VoxBox.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $135;
    };
    const VoxBox$new = x0 => x1 => x2 => VoxBox$new$(x0, x1, x2);

    function VoxBox$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$bit_length$(((2 * _capacity$1) >>> 0)))));
        var $136 = VoxBox$new$(0, _capacity$1, _buffer$2);
        return $136;
    };
    const VoxBox$alloc_capacity = x0 => VoxBox$alloc_capacity$(x0);

    function BitsMap$(_A$1) {
        var $137 = null;
        return $137;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $138 = null;
        return $138;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $139 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $139;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $140 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $140;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $142 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $144 = self.val;
                        var $145 = self.lft;
                        var $146 = self.rgt;
                        var $147 = BitsMap$tie$($144, BitsMap$set$($142, _val$3, $145), $146);
                        var $143 = $147;
                        break;
                    case 'BitsMap.new':
                        var $148 = BitsMap$tie$(Maybe$none, BitsMap$set$($142, _val$3, BitsMap$new), BitsMap$new);
                        var $143 = $148;
                        break;
                };
                var $141 = $143;
                break;
            case 'i':
                var $149 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $151 = self.val;
                        var $152 = self.lft;
                        var $153 = self.rgt;
                        var $154 = BitsMap$tie$($151, $152, BitsMap$set$($149, _val$3, $153));
                        var $150 = $154;
                        break;
                    case 'BitsMap.new':
                        var $155 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($149, _val$3, BitsMap$new));
                        var $150 = $155;
                        break;
                };
                var $141 = $150;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $157 = self.lft;
                        var $158 = self.rgt;
                        var $159 = BitsMap$tie$(Maybe$some$(_val$3), $157, $158);
                        var $156 = $159;
                        break;
                    case 'BitsMap.new':
                        var $160 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $156 = $160;
                        break;
                };
                var $141 = $156;
                break;
        };
        return $141;
    };
    const BitsMap$set = x0 => x1 => x2 => BitsMap$set$(x0, x1, x2);
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');
    const Bits$i = a0 => (a0 + '1');
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $162 = self.pred;
                var $163 = (Word$to_bits$($162) + '0');
                var $161 = $163;
                break;
            case 'Word.i':
                var $164 = self.pred;
                var $165 = (Word$to_bits$($164) + '1');
                var $161 = $165;
                break;
            case 'Word.e':
                var $166 = Bits$e;
                var $161 = $166;
                break;
        };
        return $161;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $168 = Bits$e;
            var $167 = $168;
        } else {
            var $169 = self.charCodeAt(0);
            var $170 = self.slice(1);
            var $171 = (String$to_bits$($170) + (u16_to_bits($169)));
            var $167 = $171;
        };
        return $167;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $173 = self.head;
                var $174 = self.tail;
                var self = $173;
                switch (self._) {
                    case 'Pair.new':
                        var $176 = self.fst;
                        var $177 = self.snd;
                        var $178 = BitsMap$set$(String$to_bits$($176), $177, Map$from_list$($174));
                        var $175 = $178;
                        break;
                };
                var $172 = $175;
                break;
            case 'List.nil':
                var $179 = BitsMap$new;
                var $172 = $179;
                break;
        };
        return $172;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function List$(_A$1) {
        var $180 = null;
        return $180;
    };
    const List = x0 => List$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $181 = null;
        return $181;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Web$Kaelin$Entity$char$(_img$1) {
        var $182 = ({
            _: 'Web.Kaelin.Entity.char',
            'img': _img$1
        });
        return $182;
    };
    const Web$Kaelin$Entity$char = x0 => Web$Kaelin$Entity$char$(x0);
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Word$shift_left$(_n$2, _value$3) {
        var Word$shift_left$ = (_n$2, _value$3) => ({
            ctr: 'TCO',
            arg: [_n$2, _value$3]
        });
        var Word$shift_left = _n$2 => _value$3 => Word$shift_left$(_n$2, _value$3);
        var arg = [_n$2, _value$3];
        while (true) {
            let [_n$2, _value$3] = arg;
            var R = (() => {
                var self = _n$2;
                if (self === 0n) {
                    var $183 = _value$3;
                    return $183;
                } else {
                    var $184 = (self - 1n);
                    var $185 = Word$shift_left$($184, Word$shift_left1$(_value$3));
                    return $185;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$shift_left = x0 => x1 => Word$shift_left$(x0, x1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $187 = Bool$false;
                var $186 = $187;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $188 = Bool$true;
                var $186 = $188;
                break;
        };
        return $186;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);
    const Cmp$ltn = ({
        _: 'Cmp.ltn'
    });
    const Cmp$gtn = ({
        _: 'Cmp.gtn'
    });

    function Word$cmp$go$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $190 = self.pred;
                var $191 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $193 = self.pred;
                            var $194 = (_a$pred$10 => {
                                var $195 = Word$cmp$go$(_a$pred$10, $193, _c$4);
                                return $195;
                            });
                            var $192 = $194;
                            break;
                        case 'Word.i':
                            var $196 = self.pred;
                            var $197 = (_a$pred$10 => {
                                var $198 = Word$cmp$go$(_a$pred$10, $196, Cmp$ltn);
                                return $198;
                            });
                            var $192 = $197;
                            break;
                        case 'Word.e':
                            var $199 = (_a$pred$8 => {
                                var $200 = _c$4;
                                return $200;
                            });
                            var $192 = $199;
                            break;
                    };
                    var $192 = $192($190);
                    return $192;
                });
                var $189 = $191;
                break;
            case 'Word.i':
                var $201 = self.pred;
                var $202 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $204 = self.pred;
                            var $205 = (_a$pred$10 => {
                                var $206 = Word$cmp$go$(_a$pred$10, $204, Cmp$gtn);
                                return $206;
                            });
                            var $203 = $205;
                            break;
                        case 'Word.i':
                            var $207 = self.pred;
                            var $208 = (_a$pred$10 => {
                                var $209 = Word$cmp$go$(_a$pred$10, $207, _c$4);
                                return $209;
                            });
                            var $203 = $208;
                            break;
                        case 'Word.e':
                            var $210 = (_a$pred$8 => {
                                var $211 = _c$4;
                                return $211;
                            });
                            var $203 = $210;
                            break;
                    };
                    var $203 = $203($201);
                    return $203;
                });
                var $189 = $202;
                break;
            case 'Word.e':
                var $212 = (_b$5 => {
                    var $213 = _c$4;
                    return $213;
                });
                var $189 = $212;
                break;
        };
        var $189 = $189(_b$3);
        return $189;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $214 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $214;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$gte$(_a$2, _b$3) {
        var $215 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $215;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $216 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $216;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $218 = self.pred;
                var $219 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $221 = self.pred;
                            var $222 = (_a$pred$9 => {
                                var $223 = Word$o$(Word$or$(_a$pred$9, $221));
                                return $223;
                            });
                            var $220 = $222;
                            break;
                        case 'Word.i':
                            var $224 = self.pred;
                            var $225 = (_a$pred$9 => {
                                var $226 = Word$i$(Word$or$(_a$pred$9, $224));
                                return $226;
                            });
                            var $220 = $225;
                            break;
                        case 'Word.e':
                            var $227 = (_a$pred$7 => {
                                var $228 = Word$e;
                                return $228;
                            });
                            var $220 = $227;
                            break;
                    };
                    var $220 = $220($218);
                    return $220;
                });
                var $217 = $219;
                break;
            case 'Word.i':
                var $229 = self.pred;
                var $230 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $232 = self.pred;
                            var $233 = (_a$pred$9 => {
                                var $234 = Word$i$(Word$or$(_a$pred$9, $232));
                                return $234;
                            });
                            var $231 = $233;
                            break;
                        case 'Word.i':
                            var $235 = self.pred;
                            var $236 = (_a$pred$9 => {
                                var $237 = Word$i$(Word$or$(_a$pred$9, $235));
                                return $237;
                            });
                            var $231 = $236;
                            break;
                        case 'Word.e':
                            var $238 = (_a$pred$7 => {
                                var $239 = Word$e;
                                return $239;
                            });
                            var $231 = $238;
                            break;
                    };
                    var $231 = $231($229);
                    return $231;
                });
                var $217 = $230;
                break;
            case 'Word.e':
                var $240 = (_b$4 => {
                    var $241 = Word$e;
                    return $241;
                });
                var $217 = $240;
                break;
        };
        var $217 = $217(_b$3);
        return $217;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right1$aux$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $243 = self.pred;
                var $244 = Word$o$(Word$shift_right1$aux$($243));
                var $242 = $244;
                break;
            case 'Word.i':
                var $245 = self.pred;
                var $246 = Word$i$(Word$shift_right1$aux$($245));
                var $242 = $246;
                break;
            case 'Word.e':
                var $247 = Word$o$(Word$e);
                var $242 = $247;
                break;
        };
        return $242;
    };
    const Word$shift_right1$aux = x0 => Word$shift_right1$aux$(x0);

    function Word$shift_right1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $249 = self.pred;
                var $250 = Word$shift_right1$aux$($249);
                var $248 = $250;
                break;
            case 'Word.i':
                var $251 = self.pred;
                var $252 = Word$shift_right1$aux$($251);
                var $248 = $252;
                break;
            case 'Word.e':
                var $253 = Word$e;
                var $248 = $253;
                break;
        };
        return $248;
    };
    const Word$shift_right1 = x0 => Word$shift_right1$(x0);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $255 = self.pred;
                var $256 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $258 = self.pred;
                            var $259 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $261 = Word$i$(Word$subber$(_a$pred$10, $258, Bool$true));
                                    var $260 = $261;
                                } else {
                                    var $262 = Word$o$(Word$subber$(_a$pred$10, $258, Bool$false));
                                    var $260 = $262;
                                };
                                return $260;
                            });
                            var $257 = $259;
                            break;
                        case 'Word.i':
                            var $263 = self.pred;
                            var $264 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $266 = Word$o$(Word$subber$(_a$pred$10, $263, Bool$true));
                                    var $265 = $266;
                                } else {
                                    var $267 = Word$i$(Word$subber$(_a$pred$10, $263, Bool$true));
                                    var $265 = $267;
                                };
                                return $265;
                            });
                            var $257 = $264;
                            break;
                        case 'Word.e':
                            var $268 = (_a$pred$8 => {
                                var $269 = Word$e;
                                return $269;
                            });
                            var $257 = $268;
                            break;
                    };
                    var $257 = $257($255);
                    return $257;
                });
                var $254 = $256;
                break;
            case 'Word.i':
                var $270 = self.pred;
                var $271 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $273 = self.pred;
                            var $274 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $276 = Word$o$(Word$subber$(_a$pred$10, $273, Bool$false));
                                    var $275 = $276;
                                } else {
                                    var $277 = Word$i$(Word$subber$(_a$pred$10, $273, Bool$false));
                                    var $275 = $277;
                                };
                                return $275;
                            });
                            var $272 = $274;
                            break;
                        case 'Word.i':
                            var $278 = self.pred;
                            var $279 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $281 = Word$i$(Word$subber$(_a$pred$10, $278, Bool$true));
                                    var $280 = $281;
                                } else {
                                    var $282 = Word$o$(Word$subber$(_a$pred$10, $278, Bool$false));
                                    var $280 = $282;
                                };
                                return $280;
                            });
                            var $272 = $279;
                            break;
                        case 'Word.e':
                            var $283 = (_a$pred$8 => {
                                var $284 = Word$e;
                                return $284;
                            });
                            var $272 = $283;
                            break;
                    };
                    var $272 = $272($270);
                    return $272;
                });
                var $254 = $271;
                break;
            case 'Word.e':
                var $285 = (_b$5 => {
                    var $286 = Word$e;
                    return $286;
                });
                var $254 = $285;
                break;
        };
        var $254 = $254(_b$3);
        return $254;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $287 = Word$subber$(_a$2, _b$3, Bool$false);
        return $287;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);

    function Word$div$go$(_shift$2, _sub_copy$3, _shift_copy$4, _value$5) {
        var Word$div$go$ = (_shift$2, _sub_copy$3, _shift_copy$4, _value$5) => ({
            ctr: 'TCO',
            arg: [_shift$2, _sub_copy$3, _shift_copy$4, _value$5]
        });
        var Word$div$go = _shift$2 => _sub_copy$3 => _shift_copy$4 => _value$5 => Word$div$go$(_shift$2, _sub_copy$3, _shift_copy$4, _value$5);
        var arg = [_shift$2, _sub_copy$3, _shift_copy$4, _value$5];
        while (true) {
            let [_shift$2, _sub_copy$3, _shift_copy$4, _value$5] = arg;
            var R = (() => {
                var self = Word$gte$(_sub_copy$3, _shift_copy$4);
                if (self) {
                    var _mask$6 = Word$shift_left$(_shift$2, Word$inc$(Word$to_zero$(_sub_copy$3)));
                    var $288 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $288;
                } else {
                    var $289 = Pair$new$(Bool$false, _value$5);
                    var self = $289;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $290 = self.fst;
                        var $291 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $293 = $291;
                            var $292 = $293;
                        } else {
                            var $294 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right1$(_shift_copy$4);
                            var self = $290;
                            if (self) {
                                var $296 = Word$div$go$($294, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $291);
                                var $295 = $296;
                            } else {
                                var $297 = Word$div$go$($294, _sub_copy$3, _new_shift_copy$9, $291);
                                var $295 = $297;
                            };
                            var $292 = $295;
                        };
                        return $292;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$div$go = x0 => x1 => x2 => x3 => Word$div$go$(x0, x1, x2, x3);

    function Word$div$(_a$2, _b$3) {
        var _a_bits$4 = Word$bit_length$(_a$2);
        var _b_bits$5 = Word$bit_length$(_b$3);
        var self = (_a_bits$4 < _b_bits$5);
        if (self) {
            var $299 = Word$to_zero$(_a$2);
            var $298 = $299;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $300 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $298 = $300;
        };
        return $298;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);
    const U32$length = a0 => ((a0.length) >>> 0);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $302 = Bool$false;
                var $301 = $302;
                break;
            case 'Cmp.eql':
                var $303 = Bool$true;
                var $301 = $303;
                break;
        };
        return $301;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);

    function Word$eql$(_a$2, _b$3) {
        var $304 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $304;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U32$eql = a0 => a1 => (a0 === a1);
    const U32$inc = a0 => ((a0 + 1) >>> 0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

    function Word$slice$(_a$2, _b$3, _str$4) {
        var Word$slice$ = (_a$2, _b$3, _str$4) => ({
            ctr: 'TCO',
            arg: [_a$2, _b$3, _str$4]
        });
        var Word$slice = _a$2 => _b$3 => _str$4 => Word$slice$(_a$2, _b$3, _str$4);
        var arg = [_a$2, _b$3, _str$4];
        while (true) {
            let [_a$2, _b$3, _str$4] = arg;
            var R = Word$slice$(_a$2, _b$3, _str$4);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$slice = x0 => x1 => x2 => Word$slice$(x0, x1, x2);
    const U32$slice = a0 => a1 => a2 => (a2.slice(a0, a1));
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);
    const U32$read_base = a0 => a1 => (parseInt(a1, a0));

    function VoxBox$parse_byte$(_idx$1, _voxdata$2) {
        var _chr$3 = (_voxdata$2.slice(((_idx$1 * 2) >>> 0), ((((_idx$1 * 2) >>> 0) + 2) >>> 0)));
        var $305 = (parseInt(_chr$3, 16));
        return $305;
    };
    const VoxBox$parse_byte = x0 => x1 => VoxBox$parse_byte$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $307 = Word$e;
            var $306 = $307;
        } else {
            var $308 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $310 = self.pred;
                    var $311 = Word$o$(Word$trim$($308, $310));
                    var $309 = $311;
                    break;
                case 'Word.i':
                    var $312 = self.pred;
                    var $313 = Word$i$(Word$trim$($308, $312));
                    var $309 = $313;
                    break;
                case 'Word.e':
                    var $314 = Word$o$(Word$trim$($308, Word$e));
                    var $309 = $314;
                    break;
            };
            var $306 = $309;
        };
        return $306;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $316 = self.value;
                var $317 = $316;
                var $315 = $317;
                break;
            case 'Array.tie':
                var $318 = Unit$new;
                var $315 = $318;
                break;
        };
        return $315;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $320 = self.lft;
                var $321 = self.rgt;
                var $322 = Pair$new$($320, $321);
                var $319 = $322;
                break;
            case 'Array.tip':
                var $323 = Unit$new;
                var $319 = $323;
                break;
        };
        return $319;
    };
    const Array$extract_tie = x0 => Array$extract_tie$(x0);

    function Word$foldl$(_nil$3, _w0$4, _w1$5, _word$6) {
        var Word$foldl$ = (_nil$3, _w0$4, _w1$5, _word$6) => ({
            ctr: 'TCO',
            arg: [_nil$3, _w0$4, _w1$5, _word$6]
        });
        var Word$foldl = _nil$3 => _w0$4 => _w1$5 => _word$6 => Word$foldl$(_nil$3, _w0$4, _w1$5, _word$6);
        var arg = [_nil$3, _w0$4, _w1$5, _word$6];
        while (true) {
            let [_nil$3, _w0$4, _w1$5, _word$6] = arg;
            var R = (() => {
                var self = _word$6;
                switch (self._) {
                    case 'Word.o':
                        var $324 = self.pred;
                        var $325 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $324);
                        return $325;
                    case 'Word.i':
                        var $326 = self.pred;
                        var $327 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $326);
                        return $327;
                    case 'Word.e':
                        var $328 = _nil$3;
                        return $328;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $329 = Word$foldl$((_arr$6 => {
            var $330 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $330;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $332 = self.fst;
                    var $333 = self.snd;
                    var $334 = Array$tie$(_rec$7($332), $333);
                    var $331 = $334;
                    break;
            };
            return $331;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $336 = self.fst;
                    var $337 = self.snd;
                    var $338 = Array$tie$($336, _rec$7($337));
                    var $335 = $338;
                    break;
            };
            return $335;
        }), _idx$3)(_arr$5);
        return $329;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $339 = Array$mut$(_idx$3, (_x$6 => {
            var $340 = _val$4;
            return $340;
        }), _arr$5);
        return $339;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const VoxBox$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const VoxBox$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $342 = self.capacity;
                var $343 = self.buffer;
                var $344 = VoxBox$new$(_length$1, $342, $343);
                var $341 = $344;
                break;
        };
        return $341;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function VoxBox$parse$(_voxdata$1) {
        var _siz$2 = ((((_voxdata$1.length) >>> 0) / 12) >>> 0);
        var _img$3 = VoxBox$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $346 = _img$3;
            var $347 = 0;
            var $348 = _siz$2;
            let _img$5 = $346;
            for (let _i$4 = $347; _i$4 < $348; ++_i$4) {
                var _x$6 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var $346 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                _img$5 = $346;
            };
            return _img$5;
        })();
        var $345 = _img$4;
        return $345;
    };
    const VoxBox$parse = x0 => VoxBox$parse$(x0);
    const Kaelin$Assets$chars$croni0_d_1 = VoxBox$parse$("0f0b16351d4d100b16351d4d0d0c15351d4d0e0c15351d4d0f0c156a3a86100c158e4a9d110c15351d4d120c15351d4d0c0d14351d4d0d0d146a3a860e0d146a3a860f0d148e4a9d100d146a3a86110d146a3a86120d146a3a86130d14351d4d0b0e13351d4d0c0e136a3a860d0e136a3a860e0e136a3a860f0e136a3a86100e136a3a86110e136a3a86120e136a3a86130e136a3a86140e13351d4d0a0f12351d4d0b0f126a3a860c0f126a3a860d0f126a3a860e0f126a3a860f0f126a3a86100f126a3a86110f126a3a86120f126a3a86130f126a3a86140f126a3a86150f12351d4d0a1011351d4d0b10116a3a860c10116a3a860d10116a3a860e10116a3a860f10116a3a861010116a3a861110116a3a861210116a3a861310116a3a861410116a3a86151011351d4d091110351d4d0a11106a3a860b11106a3a860c11106a3a860d11106a3a860e11106a3a860f11106a3a861011106a3a861111106a3a861211106a3a861311106a3a861411106a3a861511106a3a86161110351d4d09120f351d4d0a120f6a3a860b120f6a3a860c120f602d800d120f602d800e120f6a3a860f120f6a3a8610120f6a3a8611120f6a3a8612120f602d8013120f602d8014120f6a3a8615120f6a3a8616120f351d4d09130e351d4d0a130e602d800b130e602d800c130e351d4d0d130e351d4d0e130e6a3a860f130e6a3a8610130e6a3a8611130e6a3a8612130e351d4d13130e351d4d14130e602d8015130e602d8016130e351d4d09140d351d4d0a140d602d800b140d351d4d0c140d351d4d0d140d531e480e140d351d4d0f140d6a3a8610140d6a3a8611140d351d4d12140d531e4813140d351d4d14140d351d4d15140d4a358016140d351d4d09150c351d4d0a150c4a35800b150c351d4d0c150c531e480d150cdf3e460e150c531e480f150c351d4d10150c351d4d11150c531e4812150cdf3e4613150c531e4814150c351d4d15150c4a358016150c351d4d0a160b351d4d0b160b4a35800c160b351d4d0d160b531e480e160b351d4d0f160b351d4d10160b351d4d11160b351d4d12160b531e4813160b351d4d14160b4a358015160b351d4d0b170a351d4d0c170a4a35800d170a8e4a9d0e170a351d4d0f170a351d4d10170a351d4d11170a351d4d12170a8e4a9d13170a4a358014170a351d4d0d1809351d4d0e1809602d800f1809602d801018094a3580111809602d80121809351d4d0c1908351d4d0d19086a3a860e19086a3a860f19086a3a861019084a35801119086a3a861219086a3a86131908351d4d0c1a07351d4d0d1a076a3a860e1a076a3a860f1a076a3a86101a074a3580111a076a3a86121a076a3a86131a07351d4d0c1b06351d4d0d1b068e4a9d0e1b066a3a860f1b066a3a86101b064a3580111b066a3a86121b068e4a9d131b06351d4d0d1c05351d4d0e1c05351d4d0f1c05351d4d101c05351d4d111c05351d4d121c05351d4d111d04351d4d121d04351d4d");
    const Kaelin$Assets$chars$cyclope_d_1 = VoxBox$parse$("0e0a212c333d0f0a212c333d100a212c333d110a212c333d0d0b202c333d0e0b20fff9e10f0b20fff9e1100b20fff9e1110b20fff9e1120b202c333d0d0c1f2c333d0e0c1ffff9e10f0c1ffff9e1100c1ffff9e1110c1ffff9e1120c1f2c333d0c0d1e2729600d0d1e2729600e0d1efff9e10f0d1eccc8b7100d1eccc8b7110d1eccc8b7120d1e272960130d1e272960140d1e2729600c0e1d2729600d0e1d2729600e0e1dfff9e10f0e1dccc8b7100e1dccc8b7110e1dccc8b7120e1d272960130e1d272960140e1d272960050f1c272960060f1c272960070f1c272960090f1c2729600a0f1c2729600b0f1c2729600c0f1c5176b80d0f1cfff9e10e0f1cdfdbc80f0f1cdfdbc8100f1cdfdbc8110f1cdfdbc8120f1cccc8b7130f1c5176b8140f1c5176b8150f1c27296005101b27296006101b799cd307101b799cd308101b27296009101b5176b80a101b5176b80b101b5176b80c101b799cd30d101b5176b80e101bdfdbc80f101bccc8b710101bccc8b711101bccc8b712101b5176b813101b799cd314101b799cd315101b5176b816101b27296017101b27296018101b27296005111a27296006111a799cd307111a799cd308111a27296009111a5176b80a111a5176b80b111a5176b80c111a799cd30d111a5176b80e111adfdbc80f111accc8b710111accc8b711111accc8b712111a5176b813111a799cd314111a799cd315111a5176b816111a27296017111a27296018111a2729600512192729600612195176b80712195176b8081219394c87091219799cd30a1219799cd30b1219799cd30c12195176b80d12194a2b710e12194a2b710f12194a2b711012194a2b711112194a2b711212194a2b711312195176b81412195176b8151219799cd31612192729601712192729601812192729600513182729600613185176b80713185176b8081318394c87091318799cd30a1318799cd30b1318799cd30c13185176b80d13184a2b710e13184a2b710f13184a2b711013184a2b711113184a2b711213184a2b711313185176b81413185176b8151318799cd3161318272960171318272960181318272960051417272960061417272960071417272960081417394c870914175176b80a14175176b80b14175176b80c14174a2b710d1417dab04d0e1417dab04d0f1417dab04d101417dab04d111417dab04d121417dab04d1314174a2b711414174a2b711514175176b8161417394c87171417394c87181417394c871914172729601a1417272960051516272960061516799cd3071516799cd3081516394c870915165176b80a15165176b80b15165176b80c15164a2b710d1516dab04d0e1516fff9e10f1516fff9e1101516fff9e1111516fff9e1121516dab04d1315164a2b711415164a2b711515165176b8161516394c87171516394c87181516394c87191516799cd31a1516272960051615272960061615799cd3071615799cd3081615394c870916155176b80a16155176b80b16155176b80c16154a2b710d1615dab04d0e1615fff9e10f1615fff9e1101615fff9e1111615fff9e1121615dab04d1316154a2b711416154a2b711516155176b8161615394c87171615394c87181615394c87191615799cd31a1615272960051714272960061714272960071714272960081714394c870917145176b80a17145176b80b17145176b80c17144a2b710d1714dab04d0e17142421260f1714242126101714242126111714242126121714dab04d1317144a2b711417144a2b711517145176b8161714394c87171714394c87181714394c871917142729601a17145176b81b17142729600518132729600618135176b80718135176b8081813394c870918135176b80a18135176b80b18135176b80c18135176b80d18134a2b710e18134a2b710f18134a2b711018134a2b711118134a2b711218134a2b711318135176b81418135176b81518135176b8161813394c87171813394c87181813394c87191813799cd31a1813799cd31b18132729600519122729600619125176b80719125176b8081912394c870919125176b80a19125176b80b19125176b80c19125176b80d19124a2b710e19124a2b710f19124a2b711019124a2b711119124a2b711219124a2b711319125176b81419125176b81519125176b8161912394c87171912394c87181912394c87191912799cd31a1912799cd31b1912272960051a11272960061a115176b8071a115176b8081a11394c87091a115176b80a1a115176b80b1a115176b80c1a115176b80d1a114a2b710e1a114a2b710f1a114a2b71101a114a2b71111a114a2b71121a114a2b71131a115176b8141a115176b8151a115176b8161a11394c87171a11394c87181a11394c87191a11799cd31a1a11799cd31b1a11272960051b10272960061b10799cd3071b10799cd3081b105176b8091b10394c870a1b10394c870b1b10394c870c1b10dfdbc80d1b105176b80e1b105176b80f1b105176b8101b105176b8111b105176b8121b105176b8131b10dfdbc8141b10dfdbc8151b10394c87161b105176b8171b105176b8181b105176b8191b105176b81a1b10799cd31b1b10272960061c0f272960071c0f272960081c0f272960091c0f394c870a1c0f394c870b1c0f394c870c1c0fdfdbc80d1c0f4662a10e1c0f4662a10f1c0f4662a1101c0f4662a1111c0f4662a1121c0f4662a1131c0fdfdbc8141c0fdfdbc8151c0f394c87161c0f394c87171c0f394c87181c0f394c87191c0f5176b81a1c0f5176b81b1c0f272960081d0e272960091d0e5176b80a1d0e5176b80b1d0e5176b80c1d0e394c870d1d0e394c870e1d0e394c870f1d0e394c87101d0e394c87111d0e394c87121d0e394c87131d0e394c87141d0e394c87151d0e5176b8161d0e394c87171d0e394c87181d0e394c87191d0e5176b81a1d0e5176b81b1d0e272960081e0d272960091e0d5176b80a1e0d5176b80b1e0d5176b80c1e0d394c870d1e0d394c870e1e0d394c870f1e0d394c87101e0d394c87111e0d394c87121e0d394c87131e0d394c87141e0d394c87151e0d5176b8161e0d394c87171e0d394c87181e0d394c87191e0d5176b81a1e0d5176b81b1e0d272960081f0c272960091f0c5176b80a1f0c5176b80b1f0c5176b80c1f0c394c870d1f0c394c870e1f0c394c870f1f0c394c87101f0c394c87111f0c394c87121f0c394c87131f0c394c87141f0c394c87151f0c5176b8161f0c394c87171f0c394c87181f0c394c87191f0c5176b81a1f0c5176b81b1f0c27296008200b27296009200b5176b80a200b5176b80b200b5176b80c200b5176b80d200b5176b80e200b5176b80f200b5176b810200b5176b811200b5176b812200b5176b813200b5176b814200b5176b815200b394c8716200b799cd317200b799cd318200b799cd319200b5176b81a200b5176b81b200b27296008210a27296009210a8e4a9d0a210a8e4a9d0b210a8e4a9d0c210a8e4a9d0d210a5176b80e210a5176b80f210a5176b810210a5176b811210a5176b812210a5176b813210a394c8714210a394c8715210a394c8716210a799cd317210a799cd318210a799cd319210a799cd31a210a5176b81b210a2729600922092729600a22092729600b22092729600c22094a2b710d22098e4a9d0e22098e4a9d0f22098e4a9d1022098e4a9d1122098e4a9d1222098e4a9d132209394c87142209394c871522095176b8162209394c87172209394c87182209394c87192209394c871a22092729600923082729600a23082729600b23082729600c23084a2b710d23088e4a9d0e23088e4a9d0f23088e4a9d1023088e4a9d1123088e4a9d1223088e4a9d132308394c87142308394c871523085176b8162308394c87172308394c87182308394c87192308394c871a23082729600924072729600a24072729600b24072729600c24074a2b710d24078e4a9d0e24078e4a9d0f24078e4a9d1024078e4a9d1124078e4a9d1224078e4a9d132407394c87142407394c871524075176b8162407394c87172407394c87182407394c87192407394c871a24072729600925062729600a25062729600b25062729600c25065176b80d25064a2b710e25068e4a9d0f25068e4a9d1025068e4a9d1125068e4a9d1225064a2b71132506394c87142506394c87152506799cd3162506799cd3172506799cd3182506799cd31925065176b81a25062729600926052729600a26052729600b26052729600c2605799cd30d2605799cd30e26054a2b710f26054a2b711026054a2b711126054a2b711226052729601326052729601426052729601526052729601626052729601726052729601826052729601926052729600927042729600a27042729600b27042729600c27042729600d27042729600e2704272960");
    const Kaelin$Assets$chars$lela_d_1 = VoxBox$parse$("091219fb4d4d0a1219fb4d4d0b1219fb4d4d0c1219fb4d4d131219fb4d4d141219fb4d4d151219fb4d4d161219fb4d4d081318fb4d4d0913182b496c0a13182b496c0b13182b496c0c13182b496c0d1318fb4d4d121318fb4d4d1313182b496c1413182b496c1513182b496c1613182b496c171318fb4d4d071417fb4d4d0814172b496c09141781aeff0a141781aeff0b141781aeff0c141781aeff0d14172b496c0e1417fb4d4d0f1417fb4d4d101417fb4d4d111417fb4d4d1214172b496c13141781aeff14141781aeff15141781aeff16141781aeff1714172b496c181417fb4d4d071516fb4d4d0815161f3b5b091516538ccf0a1516538ccf0b1516538ccf0c1516538ccf0d1516538ccf0e15162b496c0f15162b496c1015162b496c1115162b496c121516538ccf131516538ccf141516538ccf151516538ccf161516538ccf1715161f3b5b181516fb4d4d071615fb4d4d0816151f3b5b091615538ccf0a1615538ccf0b1615538ccf0c1615538ccf0d1615538ccf0e161581aeff0f161581aeff10161581aeff11161581aeff121615538ccf131615538ccf141615538ccf151615538ccf161615538ccf1716151f3b5b181615fb4d4d071714fb4d4d0817141f3b5b091714538ccf0a1714538ccf0b1714538ccf0c1714538ccf0d1714538ccf0e1714538ccf0f1714538ccf101714538ccf111714538ccf121714538ccf131714538ccf141714538ccf151714538ccf161714538ccf1717141f3b5b181714fb4d4d081813fb4d4d0918131f3b5b0a1813538ccf0b1813538ccf0c1813538ccf0d1813538ccf0e1813538ccf0f1813cb4646101813cb4646111813538ccf121813538ccf131813538ccf141813538ccf151813538ccf1618131f3b5b171813fb4d4d091912fb4d4d0a19121f3b5b0b1912538ccf0c1912538ccf0d1912538ccf0e1912538ccf0f1912ad1f1f101912ad1f1f111912538ccf121912538ccf131912538ccf141912538ccf1519121f3b5b161912fb4d4d091a11fb4d4d0a1a111f3b5b0b1a11538ccf0c1a11538ccf0d1a11cb46460e1a11538ccf0f1a11538ccf101a11538ccf111a11538ccf121a11cb4646131a11538ccf141a11538ccf151a111f3b5b161a11fb4d4d091b10fb4d4d0a1b101f3b5b0b1b10538ccf0c1b10538ccf0d1b10ad1f1f0e1b10538ccf0f1b103d5497101b103d5497111b10538ccf121b10ad1f1f131b10538ccf141b10538ccf151b101f3b5b161b10fb4d4d0a1c0ffb4d4d0b1c0f1f3b5b0c1c0f538ccf0d1c0f538ccf0e1c0f538ccf0f1c0f2d4382101c0f2d4382111c0f538ccf121c0f538ccf131c0f538ccf141c0f1f3b5b151c0ffb4d4d0b1d0efb4d4d0c1d0e1f3b5b0d1d0e3a67b70e1d0e538ccf0f1d0e203368101d0e203368111d0e538ccf121d0e3a67b7131d0e1f3b5b141d0efb4d4d0a1e0dfb4d4d0b1e0d1f3b5b0c1e0d538ccf0d1e0d538ccf0e1e0d3a67b70f1e0d3a67b7101e0d3a67b7111e0d3a67b7121e0d538ccf131e0d538ccf141e0d1f3b5b151e0dfb4d4d091f0cfb4d4d0a1f0c1f3b5b0b1f0c81aeff0c1f0c3a71b10d1f0c538ccf0e1f0c81aeff0f1f0c81aeff101f0c81aeff111f0c81aeff121f0c538ccf131f0c3a71b1141f0c81aeff151f0c1f3b5b161f0cfb4d4d08200bfb4d4d09200b1f3b5b0a200b538ccf0b200b538ccf0c200b3a71b10d200b538ccf0e200b538ccf0f200b538ccf10200b538ccf11200b538ccf12200b538ccf13200b3a71b114200b538ccf15200b538ccf16200b1f3b5b17200bfb4d4d08210afb4d4d09210a1f3b5b0a210a538ccf0b210a538ccf0c210a3a71b10d210a538ccf0e210a538ccf0f210a538ccf10210a538ccf11210a538ccf12210a538ccf13210a3a71b114210a538ccf15210a538ccf16210a1f3b5b17210afb4d4d082209fb4d4d0922091f3b5b0a2209538ccf0b2209538ccf0c22092753860d2209538ccf0e2209538ccf0f2209538ccf102209538ccf112209538ccf122209538ccf132209275386142209538ccf152209538ccf1622091f3b5b172209fb4d4d092308fb4d4d0a23081f3b5b0b23081f3b5b0c23081f3b5b0d23083a67b70e2308538ccf0f2308538ccf102308538ccf112308538ccf1223083a67b71323081f3b5b1423081f3b5b1523081f3b5b162308fb4d4d0a2407fb4d4d0b2407fb4d4d0c2407fb4d4d0d24071f3b5b0e24073a67b70f2407538ccf102407538ccf1124073a67b71224071f3b5b132407fb4d4d142407fb4d4d152407fb4d4d0d2506fb4d4d0e25061f3b5b0f25063a67b71025063a67b71125061f3b5b122506fb4d4d0e2605fb4d4d0f26051f3b5b1026051f3b5b112605fb4d4d0f2704fb4d4d102704fb4d4d");
    const Kaelin$Assets$chars$octoking_d_1 = VoxBox$parse$("0a0a21192a020b0a21192a020d0a21192a020e0a21192a02100a21192a02110a21192a02120a21192a02130a21192a02150a21192a02160a21192a02180a21192a02190a21192a020a0b20192a020b0b20192a020d0b20192a020e0b20192a02100b20192a02110b20192a02120b20192a02130b20192a02150b20192a02160b20192a02180b20192a02190b20192a02080c1f192a02090c1f192a020a0c1fe6d7510b0c1fe6d7510c0c1f192a020d0c1f70681e0e0c1f70681e0f0c1f192a02100c1ffff6a6110c1ffff6a6120c1ffff6a6130c1ffff6a6140c1f192a02150c1f70681e160c1f70681e170c1f192a02180c1fe6d751190c1fe6d7511a0c1f192a021b0c1f192a02080d1e192a02090d1e192a020a0d1ee6d7510b0d1ee6d7510c0d1efff6a60d0d1e192a020e0d1e192a020f0d1ee6d751100d1ee6d751110d1ee6d751120d1ee6d751130d1ee6d751140d1ee6d751150d1e192a02160d1e192a02170d1efff6a6180d1ee6d751190d1ee6d7511a0d1e192a021b0d1e192a02080e1d192a02090e1d192a020a0e1de6d7510b0e1de6d7510c0e1dfff6a60d0e1d192a020e0e1d192a020f0e1de6d751100e1de6d751110e1de6d751120e1de6d751130e1de6d751140e1de6d751150e1d192a02160e1d192a02170e1dfff6a6180e1de6d751190e1de6d7511a0e1d192a021b0e1d192a02080f1c192a02090f1c192a020a0f1cc9ae530b0f1cc9ae530c0f1ce6d7510d0f1ce6d7510e0f1ce6d7510f0f1ce6d751100f1cb8321d110f1cb8321d120f1cb8321d130f1cb8321d140f1ce6d751150f1ce6d751160f1ce6d751170f1ce6d751180f1cc9ae53190f1cc9ae531a0f1c192a021b0f1c192a0208101b192a0209101b192a020a101bc9ae530b101bc9ae530c101be6d7510d101be6d7510e101be6d7510f101be6d75110101bb8321d11101bb8321d12101bb8321d13101bb8321d14101be6d75115101be6d75116101be6d75117101be6d75118101bc9ae5319101bc9ae531a101b192a021b101b192a0205111a192a0206111a192a0207111a192a0208111a192a0209111a192a020a111a4281350b111a4281350c111a4281350d111a4281350e111a4281350f111ac9ae5310111ac9ae5311111ac9ae5312111ac9ae5313111ac9ae5314111ac9ae5315111a42813516111a42813517111a42813518111a42813519111a4281351a111a192a021b111a192a021c111a192a021d111a192a021e111a192a02041219192a020512199fd95d0612199fd95d0712199fd95d081219192a02091219192a020a12199fd95d0b12199fd95d0c12195ea6420d12195ea6420e12195ea6420f12194281351012194281351112194281351212194281351312194281351412194281351512195ea6421612195ea6421712195ea6421812199fd95d1912199fd95d1a1219192a021b1219192a021c12199fd95d1d12199fd95d1e12199fd95d1f1219192a02041318192a020513189fd95d0613189fd95d0713189fd95d081318192a02091318192a020a13189fd95d0b13189fd95d0c13185ea6420d13185ea6420e13185ea6420f13184281351013184281351113184281351213184281351313184281351413184281351513185ea6421613185ea6421713185ea6421813189fd95d1913189fd95d1a1318192a021b1318192a021c13189fd95d1d13189fd95d1e13189fd95d1f1318192a02021417192a02031417192a020414179fd95d0514175ea6420614175ea6420714175ea642081417192a02091417192a020a14175ea6420b14175ea6420c14175ea6420d14175ea6420e14175ea6420f14175ea6421014175ea6421114175ea6421214175ea6421314175ea6421414175ea6421514175ea6421614175ea6421714175ea6421814175ea6421914175ea6421a1417192a021b1417192a021c14175ea6421d14175ea6421e14175ea6421f14179fd95d201417192a02211417192a02041516192a020515165ea6420615165ea6420715165ea642081516192a02091516192a020a15164281350b15164281350c15164281350d15164281350e15164281350f15164281351015165ea6421115165ea6421215165ea6421315165ea6421415164281351515164281351615164281351715164281351815164281351915164281351a1516192a021b1516192a021c15165ea6421d15165ea6421e15165ea6421f1516192a02041615192a020516155ea6420616155ea6420716155ea642081615192a02091615192a020a16154281350b16154281350c16154281350d16154281350e16154281350f16154281351016155ea6421116155ea6421216155ea6421316155ea6421416154281351516154281351616154281351716154281351816154281351916154281351a1615192a021b1615192a021c16155ea6421d16155ea6421e16155ea6421f1615192a02051714192a02061714192a020717145ea6420817145ea6420917145ea6420a1714192a020b1714192a020c17144281350d1714e6d7510e1714e6d7510f1714e6d751101714428135111714428135121714428135131714428135141714e6d751151714e6d751161714e6d751171714428135181714192a02191714192a021a17145ea6421b17145ea6421c17145ea6421d1714192a021e1714192a02071813192a020818135ea6420918135ea6420a1813366d2a0b1813366d2a0c1813192a020d18134281350e18134281350f1813173e0f101813173e0f111813173e0f121813173e0f131813173e0f141813173e0f151813428135161813428135171813192a02181813366d2a191813366d2a1a18135ea6421b18135ea6421c1813192a02071912192a020819125ea6420919125ea6420a1912366d2a0b1912366d2a0c1912192a020d19124281350e19124281350f1912173e0f101912173e0f111912173e0f121912173e0f131912173e0f141912173e0f151912428135161912428135171912192a02181912366d2a191912366d2a1a19125ea6421b19125ea6421c1912192a02051a11192a02061a11192a02071a11192a02081a11428135091a114281350a1a115ea6420b1a115ea6420c1a114281350d1a11192a020e1a11192a020f1a119fd95d101a119fd95d111a119fd95d121a119fd95d131a119fd95d141a119fd95d151a11192a02161a11192a02171a11428135181a115ea642191a115ea6421a1a114281351b1a114281351c1a11192a021d1a11192a021e1a11192a02051b10192a02061b10192a02071b10192a02081b10428135091b104281350a1b105ea6420b1b105ea6420c1b104281350d1b10192a020e1b10192a020f1b109fd95d101b109fd95d111b109fd95d121b109fd95d131b109fd95d141b109fd95d151b10192a02161b10192a02171b10428135181b105ea642191b105ea6421a1b104281351b1b104281351c1b10192a021d1b10192a021e1b10192a02041c0f192a02051c0f366d2a061c0f366d2a071c0f192a02081c0f5ea642091c0f5ea6420a1c0f4281350b1c0f4281350c1c0f192a020d1c0f9fd95d0e1c0f9fd95d0f1c0f5ea642101c0f428135111c0f428135121c0f428135131c0f428135141c0f5ea642151c0f9fd95d161c0f9fd95d171c0f192a02181c0f428135191c0f4281351a1c0f5ea6421b1c0f5ea6421c1c0f192a021d1c0f366d2a1e1c0f366d2a1f1c0f192a02021d0e192a02031d0e192a02041d0e428135051d0e428135061d0e428135071d0e192a02081d0e428135091d0e4281350a1d0e4281350b1d0e4281350c1d0e192a020d1d0e5ea6420e1d0e5ea6420f1d0e5ea642101d0e428135111d0e428135121d0e428135131d0e428135141d0e5ea642151d0e5ea642161d0e5ea642171d0e192a02181d0e428135191d0e4281351a1d0e4281351b1d0e4281351c1d0e192a021d1d0e4281351e1d0e4281351f1d0e428135201d0e192a02211d0e192a02021e0d192a02031e0d192a02041e0d428135051e0d428135061e0d428135071e0d192a02081e0d428135091e0d4281350a1e0d4281350b1e0d4281350c1e0d192a020d1e0d5ea6420e1e0d5ea6420f1e0d5ea642101e0d428135111e0d428135121e0d428135131e0d428135141e0d5ea642151e0d5ea642161e0d5ea642171e0d192a02181e0d428135191e0d4281351a1e0d4281351b1e0d4281351c1e0d192a021d1e0d4281351e1e0d4281351f1e0d428135201e0d192a02211e0d192a02001f0c192a02011f0c192a02021f0c9fd95d031f0c9fd95d041f0c5ea642051f0c428135061f0c428135071f0c192a02081f0c5ea642091f0c5ea6420a1f0c4281350b1f0c4281350c1f0c192a020d1f0c5ea6420e1f0c5ea6420f1f0c5ea642101f0c428135111f0c428135121f0c428135131f0c428135141f0c5ea642151f0c5ea642161f0c5ea642171f0c192a02181f0c428135191f0c4281351a1f0c5ea6421b1f0c5ea6421c1f0c192a021d1f0c4281351e1f0c4281351f1f0c5ea642201f0c9fd95d211f0c9fd95d221f0c192a0202200b192a0203200b192a0204200b192a0205200b42813506200b42813507200b42813508200b192a0209200b192a020a200b366d2a0b200b366d2a0c200b192a020d200b5ea6420e200b5ea6420f200b5ea64210200b42813511200b42813512200b42813513200b42813514200b5ea64215200b5ea64216200b5ea64217200b192a0218200b366d2a19200b366d2a1a200b192a021b200b192a021c200b4281351d200b4281351e200b4281351f200b192a0220200b192a0221200b192a0202210a192a0203210a192a0204210a192a0205210a42813506210a42813507210a42813508210a192a0209210a192a020a210a366d2a0b210a366d2a0c210a192a020d210a5ea6420e210a5ea6420f210a5ea64210210a42813511210a42813512210a42813513210a42813514210a5ea64215210a5ea64216210a5ea64217210a192a0218210a366d2a19210a366d2a1a210a192a021b210a192a021c210a4281351d210a4281351e210a4281351f210a192a0220210a192a0221210a192a02052209192a02062209192a02072209192a020a2209192a020b2209192a020c2209192a020d22095ea6420e22095ea6420f22094281351022094281351122094281351222094281351322094281351422094281351522095ea6421622095ea642172209192a02182209192a02192209192a021c2209192a021d2209192a021e2209192a02052308192a02062308192a02072308192a020a2308192a020b2308192a020c2308192a020d23085ea6420e23085ea6420f23084281351023084281351123084281351223084281351323084281351423084281351523085ea6421623085ea642172308192a02182308192a02192308192a021c2308192a021d2308192a021e2308192a02082407192a02092407192a020a2407192a020b2407192a020c24075ea6420d24074281350e24074281350f2407428135102407366d2a112407366d2a122407366d2a132407366d2a1424074281351524074281351624074281351724075ea642182407192a02192407192a021a2407192a021b2407192a02072506192a020825065ea6420925065ea6420a25065ea6420b25065ea6420c25064281350d25064281350e25064281350f2506366d2a102506192a02112506192a02122506192a02132506192a02142506366d2a1525064281351625064281351725064281351825065ea6421925065ea6421a25065ea6421b25065ea6421c2506192a02072605192a020826055ea6420926055ea6420a26055ea6420b26055ea6420c26054281350d26054281350e26054281350f2605366d2a102605192a02112605192a02122605192a02132605192a02142605366d2a1526054281351626054281351726054281351826055ea6421926055ea6421a26055ea6421b26055ea6421c2605192a02082704192a02092704192a020a2704192a020b2704192a020c2704192a020d2704192a020e2704192a020f2704192a02142704192a02152704192a02162704192a02172704192a02182704192a02192704192a021a2704192a021b2704192a02");

    function Web$Kaelin$Entity$background$(_img$1) {
        var $349 = ({
            _: 'Web.Kaelin.Entity.background',
            'img': _img$1
        });
        return $349;
    };
    const Web$Kaelin$Entity$background = x0 => Web$Kaelin$Entity$background$(x0);
    const Kaelin$Assets$dark_grass_4 = VoxBox$parse$("0e00010600000f00010600001000010600000c01010600000d01010600000e0101408d640f0101408d64100101469e651101010600001201010600000a02010600000b02010600000c0201469e650d0201469e650e0201469e650f0201408d64100201469e65110201469e65120201408d641302010600001402010600000803010600000903010600000a0301469e650b0301408d640c0301469e650d0301469e650e0301469e650f0301408d64100301408d64110301408d64120301408d64130301469e65140301469e65150301060000160301060000060401060000070401060000080401469e65090401469e650a0401469e650b0401408d640c0401408d640d0401469e650e0401469e650f0401408d64100401469e65110401408d64120401408d64130401408d64140401408d64150401408d64160401408d64170401060000180401060000040501060000050501060000060501469e65070501408d64080501469e65090501469e650a0501408d640b0501408d640c0501408d640d0501347e570e0501347e570f0501469e65100501469e65110501469e65120501347e57130501408d64140501469e65150501469e65160501408d64170501469e65180501469e651905010600001a0501060000020601060000030601060000040601347e57050601469e65060601469e65070601408d64080601408d64090601347e570a0601408d640b0601408d640c0601408d640d0601408d640e0601347e570f0601469e65100601469e65110601408d64120601347e57130601347e57140601469e65150601469e65160601408d64170601408d64180601347e57190601408d641a0601408d641b06010600001c0601060000000701060000010701060000020701408d64030701408d64040701408d64050701408d64060701408d64070701408d64080701408d64090701347e570a0701347e570b0701408d640c0701469e650d0701469e650e0701408d640f0701408d64100701408d64110701408d64120701408d64130701408d64140701408d64150701408d64160701408d64170701408d64180701347e57190701347e571a0701408d641b0701469e651c0701469e651d07010600001e0701060000000801060000010801347e57020801469e65030801469e65040801408d64050801408d64060801469e65070801469e65080801408d64090801469e650a0801469e650b0801408d640c0801469e650d0801469e650e0801469e650f0801347e57100801347e57110801469e65120801469e65130801408d64140801408d64150801469e65160801469e65170801408d64180801469e65190801469e651a0801408d641b0801469e651c0801469e651d0801469e651e0801060000000901060000010901408d64020901469e65030901469e65040901408d64050901469e65060901469e65070901469e65080901408d64090901469e650a0901469e650b0901408d640c0901408d640d0901469e650e0901469e650f0901347e57100901408d64110901469e65120901469e65130901408d64140901469e65150901469e65160901469e65170901408d64180901469e65190901469e651a0901408d641b0901408d641c0901469e651d0901469e651e0901060000000a01060000010a01408d64020a01408d64030a01408d64040a01408d64050a01469e65060a01469e65070a01408d64080a01408d64090a01408d640a0a01408d640b0a01408d640c0a01408d640d0a01408d640e0a01408d640f0a01408d64100a01408d64110a01408d64120a01408d64130a01408d64140a01469e65150a01469e65160a01408d64170a01408d64180a01408d64190a01408d641a0a01408d641b0a01408d641c0a01408d641d0a01408d641e0a01060000000b01060000010b01408d64020b01408d64030b01408d64040b01408d64050b01408d64060b01408d64070b01469e65080b01469e65090b01408d640a0b01347e570b0b01347e570c0b01408d640d0b01408d640e0b01408d640f0b01469e65100b01408d64110b01408d64120b01408d64130b01408d64140b01408d64150b01408d64160b01469e65170b01469e65180b01408d64190b01347e571a0b01347e571b0b01408d641c0b01408d641d0b01408d641e0b01060000000c01060000010c01408d64020c01408d64030c01469e65040c01469e65050c01408d64060c01469e65070c01469e65080c01469e65090c01408d640a0c01347e570b0c01408d640c0c01469e650d0c01469e650e0c01408d640f0c01469e65100c01408d64110c01408d64120c01469e65130c01469e65140c01408d64150c01469e65160c01469e65170c01469e65180c01408d64190c01347e571a0c01408d641b0c01469e651c0c01469e651d0c01408d641e0c01060000000d01060000010d01408d64020d01469e65030d01469e65040d01469e65050d01408d64060d01469e65070d01469e65080d01408d64090d01408d640a0d01408d640b0d01408d640c0d01469e650d0d01469e650e0d01469e650f0d01408d64100d01408d64110d01469e65120d01469e65130d01469e65140d01408d64150d01469e65160d01469e65170d01408d64180d01408d64190d01408d641a0d01408d641b0d01469e651c0d01469e651d0d01469e651e0d01060000000e01060000010e01408d64020e01469e65030e01469e65040e01408d64050e01408d64060e01408d64070e01408d64080e01408d64090e01408d640a0e01408d640b0e01408d640c0e01408d640d0e01469e650e0e01469e650f0e01408d64100e01408d64110e01469e65120e01469e65130e01408d64140e01408d64150e01408d64160e01408d64170e01408d64180e01408d64190e01408d641a0e01408d641b0e01408d641c0e01469e651d0e01469e651e0e01060000000f01060000010f01408d64020f01469e65030f01469e65040f01408d64050f01347e57060f01408d64070f01469e65080f01469e65090f01469e650a0f01408d640b0f01469e650c0f01469e650d0f01408d640e0f01408d640f0f01469e65100f01408d64110f01469e65120f01469e65130f01408d64140f01347e57150f01408d64160f01469e65170f01469e65180f01469e65190f01408d641a0f01469e651b0f01469e651c0f01408d641d0f01408d641e0f01060000001001060000011001469e65021001469e65031001469e65041001408d64051001408d64061001408d64071001469e65081001469e65091001408d640a1001408d640b1001408d640c1001408d640d1001408d640e1001408d640f1001408d64101001469e65111001469e65121001469e65131001408d64141001408d64151001408d64161001469e65171001469e65181001408d64191001408d641a1001408d641b1001408d641c1001408d641d1001408d641e1001060000001101060000011101469e65021101469e65031101408d64041101469e65051101469e65061101408d64071101408d64081101408d64091101408d640a1101408d640b1101408d640c1101469e650d1101469e650e1101469e650f1101408d64101101469e65111101469e65121101408d64131101469e65141101469e65151101408d64161101408d64171101408d64181101408d64191101408d641a1101408d641b1101469e651c1101469e651d1101469e651e1101060000001201060000011201408d64021201408d64031201408d64041201469e65051201469e65061201408d64071201408d64081201408d64091201469e650a1201469e650b1201408d640c1201469e650d1201469e650e1201469e650f1201408d64101201408d64111201408d64121201408d64131201469e65141201469e65151201408d64161201408d64171201408d64181201469e65191201469e651a1201408d641b1201469e651c1201469e651d1201469e651e1201060000001301060000011301469e65021301408d64031301408d64041301408d64051301408d64061301408d64071301408d64081301469e65091301469e650a1301469e650b1301408d640c1301408d640d1301469e650e1301469e650f1301408d64101301469e65111301408d64121301408d64131301408d64141301408d64151301408d64161301408d64171301469e65181301469e65191301469e651a1301408d641b1301408d641c1301469e651d1301469e651e1301060000001401060000011401469e65021401469e65031401347e57041401408d64051401469e65061401469e65071401408d64081401469e65091401469e650a1401408d640b1401408d640c1401408d640d1401347e570e1401347e570f1401469e65101401469e65111401469e65121401347e57131401408d64141401469e65151401469e65161401408d64171401469e65181401469e65191401408d641a1401408d641b1401408d641c1401347e571d1401347e571e1401060000001501060000011501469e65021501408d64031501347e57041501347e57051501469e65061501469e65071501408d64081501408d64091501347e570a1501408d640b1501408d640c1501408d640d1501408d640e1501347e570f1501469e65101501469e65111501408d64121501347e57131501347e57141501469e65151501469e65161501408d64171501408d64181501347e57191501408d641a1501408d641b1501408d641c1501408d641d1501347e571e1501060000001601060000011601060000021601408d64031601408d64041601408d64051601408d64061601408d64071601408d64081601408d64091601347e570a1601347e570b1601408d640c1601469e650d1601469e650e1601408d640f1601408d64101601408d64111601408d64121601408d64131601408d64141601408d64151601408d64161601408d64171601408d64181601347e57191601347e571a1601408d641b1601469e651c1601469e651d16010600001e1601060000021701060000031701060000041701408d64051701408d64061701469e65071701469e65081701408d64091701469e650a1701469e650b1701408d640c1701469e650d1701469e650e1701469e650f1701347e57101701347e57111701469e65121701469e65131701408d64141701408d64151701469e65161701469e65171701408d64181701469e65191701469e651a1701408d641b17010600001c1701060000041801060000051801060000061801469e65071801469e65081801408d64091801469e650a1801469e650b1801408d640c1801408d640d1801469e650e1801469e650f1801347e57101801408d64111801469e65121801469e65131801408d64141801469e65151801469e65161801469e65171801408d64181801469e651918010600001a1801060000061901060000071901060000081901408d64091901408d640a1901408d640b1901408d640c1901408d640d1901408d640e1901408d640f1901408d64101901408d64111901408d64121901408d64131901408d64141901469e65151901469e65161901408d64171901060000181901060000081a01060000091a010600000a1a01347e570b1a01347e570c1a01408d640d1a01408d640e1a01408d640f1a01469e65101a01408d64111a01408d64121a01408d64131a01408d64141a01408d64151a01060000161a010600000a1b010600000b1b010600000c1b01469e650d1b01469e650e1b01408d640f1b01469e65101b01408d64111b01408d64121b01469e65131b01060000141b010600000c1c010600000d1c010600000e1c01469e650f1c01408d64101c01408d64111c01060000121c010600000e1d010600000f1d01060000101d01060000");

    function Web$Kaelin$Coord$new$(_i$1, _j$2) {
        var $350 = ({
            _: 'Web.Kaelin.Coord.new',
            'i': _i$1,
            'j': _j$2
        });
        return $350;
    };
    const Web$Kaelin$Coord$new = x0 => x1 => Web$Kaelin$Coord$new$(x0, x1);

    function String$cons$(_head$1, _tail$2) {
        var $351 = (String.fromCharCode(_head$1) + _tail$2);
        return $351;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);
    const Nat$gtn = a0 => a1 => (a0 > a1);

    function Int$is_neg$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $353 = int_pos(self);
                var $354 = int_neg(self);
                var $355 = ($354 > $353);
                var $352 = $355;
                break;
        };
        return $352;
    };
    const Int$is_neg = x0 => Int$is_neg$(x0);
    const Int$new = a0 => a1 => (a0 - a1);

    function Int$neg$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $357 = int_pos(self);
                var $358 = int_neg(self);
                var $359 = ($358 - $357);
                var $356 = $359;
                break;
        };
        return $356;
    };
    const Int$neg = x0 => Int$neg$(x0);

    function Int$abs$(_a$1) {
        var _neg$2 = Int$is_neg$(_a$1);
        var self = _neg$2;
        if (self) {
            var _a$3 = Int$neg$(_a$1);
            var self = _a$3;
            switch ("new") {
                case 'new':
                    var $362 = int_pos(self);
                    var $363 = $362;
                    var $361 = $363;
                    break;
            };
            var $360 = $361;
        } else {
            var self = _a$1;
            switch ("new") {
                case 'new':
                    var $365 = int_pos(self);
                    var $366 = $365;
                    var $364 = $366;
                    break;
            };
            var $360 = $364;
        };
        return $360;
    };
    const Int$abs = x0 => Int$abs$(x0);

    function Int$to_nat_signed$(_a$1) {
        var $367 = Pair$new$(Int$is_neg$(_a$1), Int$abs$(_a$1));
        return $367;
    };
    const Int$to_nat_signed = x0 => Int$to_nat_signed$(x0);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $369 = self.head;
                var $370 = self.tail;
                var $371 = _cons$5($369)(List$fold$($370, _nil$4, _cons$5));
                var $368 = $371;
                break;
            case 'List.nil':
                var $372 = _nil$4;
                var $368 = $372;
                break;
        };
        return $368;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $373 = null;
        return $373;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $374 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $374;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $375 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $375;
    };
    const Either$right = x0 => Either$right$(x0);

    function Nat$sub_rem$(_n$1, _m$2) {
        var Nat$sub_rem$ = (_n$1, _m$2) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2]
        });
        var Nat$sub_rem = _n$1 => _m$2 => Nat$sub_rem$(_n$1, _m$2);
        var arg = [_n$1, _m$2];
        while (true) {
            let [_n$1, _m$2] = arg;
            var R = (() => {
                var self = _m$2;
                if (self === 0n) {
                    var $376 = Either$left$(_n$1);
                    return $376;
                } else {
                    var $377 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $379 = Either$right$(Nat$succ$($377));
                        var $378 = $379;
                    } else {
                        var $380 = (self - 1n);
                        var $381 = Nat$sub_rem$($380, $377);
                        var $378 = $381;
                    };
                    return $378;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$sub_rem = x0 => x1 => Nat$sub_rem$(x0, x1);

    function Nat$div_mod$go$(_n$1, _m$2, _d$3) {
        var Nat$div_mod$go$ = (_n$1, _m$2, _d$3) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2, _d$3]
        });
        var Nat$div_mod$go = _n$1 => _m$2 => _d$3 => Nat$div_mod$go$(_n$1, _m$2, _d$3);
        var arg = [_n$1, _m$2, _d$3];
        while (true) {
            let [_n$1, _m$2, _d$3] = arg;
            var R = (() => {
                var self = Nat$sub_rem$(_n$1, _m$2);
                switch (self._) {
                    case 'Either.left':
                        var $382 = self.value;
                        var $383 = Nat$div_mod$go$($382, _m$2, Nat$succ$(_d$3));
                        return $383;
                    case 'Either.right':
                        var $384 = Pair$new$(_d$3, _n$1);
                        return $384;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$div_mod$go = x0 => x1 => x2 => Nat$div_mod$go$(x0, x1, x2);
    const Nat$div_mod = a0 => a1 => (({
        _: 'Pair.new',
        'fst': a0 / a1,
        'snd': a0 % a1
    }));

    function List$cons$(_head$2, _tail$3) {
        var $385 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $385;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function Nat$to_base$go$(_base$1, _nat$2, _res$3) {
        var Nat$to_base$go$ = (_base$1, _nat$2, _res$3) => ({
            ctr: 'TCO',
            arg: [_base$1, _nat$2, _res$3]
        });
        var Nat$to_base$go = _base$1 => _nat$2 => _res$3 => Nat$to_base$go$(_base$1, _nat$2, _res$3);
        var arg = [_base$1, _nat$2, _res$3];
        while (true) {
            let [_base$1, _nat$2, _res$3] = arg;
            var R = (() => {
                var self = (({
                    _: 'Pair.new',
                    'fst': _nat$2 / _base$1,
                    'snd': _nat$2 % _base$1
                }));
                switch (self._) {
                    case 'Pair.new':
                        var $386 = self.fst;
                        var $387 = self.snd;
                        var self = $386;
                        if (self === 0n) {
                            var $389 = List$cons$($387, _res$3);
                            var $388 = $389;
                        } else {
                            var $390 = (self - 1n);
                            var $391 = Nat$to_base$go$(_base$1, $386, List$cons$($387, _res$3));
                            var $388 = $391;
                        };
                        return $388;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $392 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $392;
    };
    const Nat$to_base = x0 => x1 => Nat$to_base$(x0, x1);
    const String$nil = '';

    function Nat$mod$go$(_n$1, _m$2, _r$3) {
        var Nat$mod$go$ = (_n$1, _m$2, _r$3) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2, _r$3]
        });
        var Nat$mod$go = _n$1 => _m$2 => _r$3 => Nat$mod$go$(_n$1, _m$2, _r$3);
        var arg = [_n$1, _m$2, _r$3];
        while (true) {
            let [_n$1, _m$2, _r$3] = arg;
            var R = (() => {
                var self = _m$2;
                if (self === 0n) {
                    var $393 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $393;
                } else {
                    var $394 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $396 = _r$3;
                        var $395 = $396;
                    } else {
                        var $397 = (self - 1n);
                        var $398 = Nat$mod$go$($397, $394, Nat$succ$(_r$3));
                        var $395 = $398;
                    };
                    return $395;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);
    const Nat$mod = a0 => a1 => (a0 % a1);
    const Bool$and = a0 => a1 => (a0 && a1);
    const Nat$lte = a0 => a1 => (a0 <= a1);

    function Maybe$(_A$1) {
        var $399 = null;
        return $399;
    };
    const Maybe = x0 => Maybe$(x0);

    function List$at$(_index$2, _list$3) {
        var List$at$ = (_index$2, _list$3) => ({
            ctr: 'TCO',
            arg: [_index$2, _list$3]
        });
        var List$at = _index$2 => _list$3 => List$at$(_index$2, _list$3);
        var arg = [_index$2, _list$3];
        while (true) {
            let [_index$2, _list$3] = arg;
            var R = (() => {
                var self = _list$3;
                switch (self._) {
                    case 'List.cons':
                        var $400 = self.head;
                        var $401 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $403 = Maybe$some$($400);
                            var $402 = $403;
                        } else {
                            var $404 = (self - 1n);
                            var $405 = List$at$($404, $401);
                            var $402 = $405;
                        };
                        return $402;
                    case 'List.nil':
                        var $406 = Maybe$none;
                        return $406;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function Nat$show_digit$(_base$1, _n$2) {
        var _m$3 = (_n$2 % _base$1);
        var _base64$4 = List$cons$(48, List$cons$(49, List$cons$(50, List$cons$(51, List$cons$(52, List$cons$(53, List$cons$(54, List$cons$(55, List$cons$(56, List$cons$(57, List$cons$(65, List$cons$(66, List$cons$(67, List$cons$(68, List$cons$(69, List$cons$(70, List$cons$(71, List$cons$(72, List$cons$(73, List$cons$(74, List$cons$(75, List$cons$(76, List$cons$(77, List$cons$(78, List$cons$(79, List$cons$(80, List$cons$(81, List$cons$(82, List$cons$(83, List$cons$(84, List$cons$(85, List$cons$(86, List$cons$(87, List$cons$(88, List$cons$(89, List$cons$(90, List$cons$(97, List$cons$(98, List$cons$(99, List$cons$(100, List$cons$(101, List$cons$(102, List$cons$(103, List$cons$(104, List$cons$(105, List$cons$(106, List$cons$(107, List$cons$(108, List$cons$(109, List$cons$(110, List$cons$(111, List$cons$(112, List$cons$(113, List$cons$(114, List$cons$(115, List$cons$(116, List$cons$(117, List$cons$(118, List$cons$(119, List$cons$(120, List$cons$(121, List$cons$(122, List$cons$(43, List$cons$(47, List$nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
        var self = ((_base$1 > 0n) && (_base$1 <= 64n));
        if (self) {
            var self = List$at$(_m$3, _base64$4);
            switch (self._) {
                case 'Maybe.some':
                    var $409 = self.value;
                    var $410 = $409;
                    var $408 = $410;
                    break;
                case 'Maybe.none':
                    var $411 = 35;
                    var $408 = $411;
                    break;
            };
            var $407 = $408;
        } else {
            var $412 = 35;
            var $407 = $412;
        };
        return $407;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $413 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $414 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $414;
        }));
        return $413;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $415 = Nat$to_string_base$(10n, _n$1);
        return $415;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function Int$show$(_a$1) {
        var _result$2 = Int$to_nat_signed$(_a$1);
        var self = _result$2;
        switch (self._) {
            case 'Pair.new':
                var $417 = self.fst;
                var $418 = self.snd;
                var self = $417;
                if (self) {
                    var $420 = ("-" + Nat$show$($418));
                    var $419 = $420;
                } else {
                    var $421 = ("+" + Nat$show$($418));
                    var $419 = $421;
                };
                var $416 = $419;
                break;
        };
        return $416;
    };
    const Int$show = x0 => Int$show$(x0);

    function Web$Kaelin$Coord$show$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $423 = self.i;
                var $424 = self.j;
                var $425 = (Int$show$($423) + (":" + Int$show$($424)));
                var $422 = $425;
                break;
        };
        return $422;
    };
    const Web$Kaelin$Coord$show = x0 => Web$Kaelin$Coord$show$(x0);

    function Map$set$(_key$2, _val$3, _map$4) {
        var $426 = BitsMap$set$(String$to_bits$(_key$2), _val$3, _map$4);
        return $426;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $428 = self.value;
                var $429 = $428;
                var $427 = $429;
                break;
            case 'Maybe.none':
                var $430 = _a$3;
                var $427 = $430;
                break;
        };
        return $427;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function BitsMap$get$(_bits$2, _map$3) {
        var BitsMap$get$ = (_bits$2, _map$3) => ({
            ctr: 'TCO',
            arg: [_bits$2, _map$3]
        });
        var BitsMap$get = _bits$2 => _map$3 => BitsMap$get$(_bits$2, _map$3);
        var arg = [_bits$2, _map$3];
        while (true) {
            let [_bits$2, _map$3] = arg;
            var R = (() => {
                var self = _bits$2;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $431 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $433 = self.lft;
                                var $434 = BitsMap$get$($431, $433);
                                var $432 = $434;
                                break;
                            case 'BitsMap.new':
                                var $435 = Maybe$none;
                                var $432 = $435;
                                break;
                        };
                        return $432;
                    case 'i':
                        var $436 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $438 = self.rgt;
                                var $439 = BitsMap$get$($436, $438);
                                var $437 = $439;
                                break;
                            case 'BitsMap.new':
                                var $440 = Maybe$none;
                                var $437 = $440;
                                break;
                        };
                        return $437;
                    case 'e':
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $442 = self.val;
                                var $443 = $442;
                                var $441 = $443;
                                break;
                            case 'BitsMap.new':
                                var $444 = Maybe$none;
                                var $441 = $444;
                                break;
                        };
                        return $441;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BitsMap$get = x0 => x1 => BitsMap$get$(x0, x1);

    function Map$get$(_key$2, _map$3) {
        var $445 = BitsMap$get$(String$to_bits$(_key$2), _map$3);
        return $445;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function Web$Kaelin$Map$push$(_coord$1, _ent$2, _map$3) {
        var _key$4 = Web$Kaelin$Coord$show$(_coord$1);
        var $446 = Map$set$(_key$4, List$cons$(_ent$2, Maybe$default$(Map$get$(_key$4, _map$3), List$nil)), _map$3);
        return $446;
    };
    const Web$Kaelin$Map$push = x0 => x1 => x2 => Web$Kaelin$Map$push$(x0, x1, x2);

    function Web$Kaelin$Draw$initial_ent$(_map$1) {
        var _ent_croni$2 = Web$Kaelin$Entity$char$(Kaelin$Assets$chars$croni0_d_1);
        var _ent_cyclope$3 = Web$Kaelin$Entity$char$(Kaelin$Assets$chars$cyclope_d_1);
        var _ent_lela$4 = Web$Kaelin$Entity$char$(Kaelin$Assets$chars$lela_d_1);
        var _ent_octoking$5 = Web$Kaelin$Entity$char$(Kaelin$Assets$chars$octoking_d_1);
        var _ent_grass$6 = Web$Kaelin$Entity$background$(Kaelin$Assets$dark_grass_4);
        var _new_coord$7 = Web$Kaelin$Coord$new;
        var _map$8 = Web$Kaelin$Map$push$(_new_coord$7((0n - 0n))((0n - 0n)), _ent_grass$6, _map$1);
        var _map$9 = Web$Kaelin$Map$push$(_new_coord$7((0n - 0n))((0n - 0n)), _ent_cyclope$3, _map$8);
        var _map$10 = Web$Kaelin$Map$push$(_new_coord$7((0n - 1n))((0n - 2n)), _ent_croni$2, _map$9);
        var _map$11 = Web$Kaelin$Map$push$(_new_coord$7((3n - 0n))((2n - 0n)), _ent_lela$4, _map$10);
        var _map$12 = Web$Kaelin$Map$push$(_new_coord$7((0n - 3n))((5n - 0n)), _ent_octoking$5, _map$11);
        var $447 = _map$12;
        return $447;
    };
    const Web$Kaelin$Draw$initial_ent = x0 => Web$Kaelin$Draw$initial_ent$(x0);

    function Web$Kaelin$State$game$(_room$1, _tick$2, _players$3, _map$4, _interface$5) {
        var $448 = ({
            _: 'Web.Kaelin.State.game',
            'room': _room$1,
            'tick': _tick$2,
            'players': _players$3,
            'map': _map$4,
            'interface': _interface$5
        });
        return $448;
    };
    const Web$Kaelin$State$game = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$State$game$(x0, x1, x2, x3, x4);
    const Web$Kaelin$Resources$room = "0x196581625483";

    function App$EnvInfo$new$(_screen_size$1, _mouse_pos$2) {
        var $449 = ({
            _: 'App.EnvInfo.new',
            'screen_size': _screen_size$1,
            'mouse_pos': _mouse_pos$2
        });
        return $449;
    };
    const App$EnvInfo$new = x0 => x1 => App$EnvInfo$new$(x0, x1);

    function DOM$text$(_value$1) {
        var $450 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $450;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function VoxBox$clear$(_img$1) {
        var $451 = VoxBox$set_length$(0, _img$1);
        return $451;
    };
    const VoxBox$clear = x0 => VoxBox$clear$(x0);
    const Web$Kaelin$Resources$map_size = 5;
    const Web$Kaelin$Resources$hexagon_radius = 15;
    const Nat$add = a0 => a1 => (a0 + a1);
    const Int$add = a0 => a1 => (a0 + a1);
    const Int$sub = a0 => a1 => (a0 - a1);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $453 = self.pred;
                var $454 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $453));
                var $452 = $454;
                break;
            case 'Word.i':
                var $455 = self.pred;
                var $456 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $455));
                var $452 = $456;
                break;
            case 'Word.e':
                var $457 = _nil$3;
                var $452 = $457;
                break;
        };
        return $452;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $458 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $459 = Nat$succ$((2n * _x$4));
            return $459;
        }), _word$2);
        return $458;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);
    const U32$to_nat = a0 => (BigInt(a0));

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $461 = Bool$true;
                var $460 = $461;
                break;
            case 'Cmp.gtn':
                var $462 = Bool$false;
                var $460 = $462;
                break;
        };
        return $460;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $463 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $463;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => (a0 <= a1);
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);

    function Web$Kaelin$Coord$fit$(_coord$1, _map_size$2) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $465 = self.i;
                var $466 = self.j;
                var _i$5 = $465;
                var _j$6 = $466;
                var _sum$7 = (_i$5 + _j$6);
                var _abs$8 = Int$abs$(_sum$7);
                var _abs$9 = (Number(_abs$8) >>> 0);
                var $467 = (_abs$9 <= ((_map_size$2 - 1) >>> 0));
                var $464 = $467;
                break;
        };
        return $464;
    };
    const Web$Kaelin$Coord$fit = x0 => x1 => Web$Kaelin$Coord$fit$(x0, x1);

    function Web$Kaelin$Draw$background$(_coord$1, _map$2) {
        var _ent_grass$3 = Web$Kaelin$Entity$background$(Kaelin$Assets$dark_grass_4);
        var _map$4 = Web$Kaelin$Map$push$(_coord$1, _ent_grass$3, _map$2);
        var $468 = _map$4;
        return $468;
    };
    const Web$Kaelin$Draw$background = x0 => x1 => Web$Kaelin$Draw$background$(x0, x1);

    function Int$from_u32$(_n$1) {
        var $469 = ((BigInt(_n$1)) - 0n);
        return $469;
    };
    const Int$from_u32 = x0 => Int$from_u32$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $471 = self.fst;
                var $472 = $471;
                var $470 = $472;
                break;
        };
        return $470;
    };
    const Pair$fst = x0 => Pair$fst$(x0);
    const Nat$div = a0 => a1 => (a0 / a1);

    function Int$div_nat$(_a$1, _n$2) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $474 = int_pos(self);
                var $475 = int_neg(self);
                var $476 = (($474 / _n$2) - ($475 / _n$2));
                var $473 = $476;
                break;
        };
        return $473;
    };
    const Int$div_nat = x0 => x1 => Int$div_nat$(x0, x1);
    const Web$Kaelin$Resources$center_x = 128;
    const Web$Kaelin$Resources$center_y = 128;
    const Int$mul = a0 => a1 => (a0 * a1);

    function Int$from_nat$(_n$1) {
        var $477 = (_n$1 - 0n);
        return $477;
    };
    const Int$from_nat = x0 => Int$from_nat$(x0);

    function Int$to_u32$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $479 = int_pos(self);
                var $480 = int_neg(self);
                var self = $480;
                if (self === 0n) {
                    var $482 = Pair$new$(Bool$false, (Number($479) >>> 0));
                    var $481 = $482;
                } else {
                    var $483 = (self - 1n);
                    var $484 = Pair$new$(Bool$true, (Number($480) >>> 0));
                    var $481 = $484;
                };
                var $478 = $481;
                break;
        };
        return $478;
    };
    const Int$to_u32 = x0 => Int$to_u32$(x0);

    function Web$Kaelin$Coord$to_screen_xy$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $486 = self.i;
                var $487 = self.j;
                var _i$4 = $486;
                var _j$5 = $487;
                var _int_rad$6 = Int$from_u32$(Web$Kaelin$Resources$hexagon_radius);
                var _hlf$7 = Int$div_nat$(_int_rad$6, 2n);
                var _int_screen_center_x$8 = Int$from_u32$(Web$Kaelin$Resources$center_x);
                var _int_screen_center_y$9 = Int$from_u32$(Web$Kaelin$Resources$center_y);
                var _cx$10 = (_int_screen_center_x$8 + (_j$5 * _int_rad$6));
                var _cx$11 = (_cx$10 + (_i$4 * (_int_rad$6 * Int$from_nat$(2n))));
                var _cy$12 = (_int_screen_center_y$9 + (_j$5 * (_hlf$7 * Int$from_nat$(3n))));
                var self = Int$to_u32$(_cx$11);
                switch (self._) {
                    case 'Pair.new':
                        var $489 = self.snd;
                        var self = Int$to_u32$(_cy$12);
                        switch (self._) {
                            case 'Pair.new':
                                var $491 = self.snd;
                                var $492 = Pair$new$($489, $491);
                                var $490 = $492;
                                break;
                        };
                        var $488 = $490;
                        break;
                };
                var $485 = $488;
                break;
        };
        return $485;
    };
    const Web$Kaelin$Coord$to_screen_xy = x0 => Web$Kaelin$Coord$to_screen_xy$(x0);

    function VoxBox$Draw$deresagon$(_cx$1, _cy$2, _cz$3, _rad$4, _col$5, _draw_a$6, _draw_b$7, _draw_c$8, _draw_d$9, _draw_e$10, _draw_f$11, _img$12) {
        var _hlf$13 = ((_rad$4 / 2) >>> 0);
        var _v0x$14 = ((_cx$1 + _rad$4) >>> 0);
        var _v0y$15 = ((_cy$2 + _hlf$13) >>> 0);
        var _v1x$16 = ((_cx$1 + _rad$4) >>> 0);
        var _v1y$17 = ((_cy$2 - _hlf$13) >>> 0);
        var _v2x$18 = _cx$1;
        var _v2y$19 = ((_cy$2 - _rad$4) >>> 0);
        var _v3x$20 = ((_cx$1 - _rad$4) >>> 0);
        var _v3y$21 = ((_cy$2 - _hlf$13) >>> 0);
        var _v4x$22 = ((_cx$1 - _rad$4) >>> 0);
        var _v4y$23 = ((_cy$2 + _hlf$13) >>> 0);
        var _v5x$24 = _cx$1;
        var _v5y$25 = ((_cy$2 + _rad$4) >>> 0);
        var self = _draw_a$6;
        if (self) {
            var _img$26 = (() => {
                var $495 = _img$12;
                var $496 = 0;
                var $497 = _rad$4;
                let _img$27 = $495;
                for (let _i$26 = $496; _i$26 < $497; ++_i$26) {
                    var _px$28 = _v1x$16;
                    var _py$29 = ((_v1y$17 + _i$26) >>> 0);
                    var $495 = ((_img$27.buffer[_img$27.length * 2] = ((0 | _px$28 | (_py$29 << 12) | (_cz$3 << 24))), _img$27.buffer[_img$27.length * 2 + 1] = _col$5, _img$27.length++, _img$27));
                    _img$27 = $495;
                };
                return _img$27;
            })();
            var $494 = _img$26;
            var _img$26 = $494;
        } else {
            var $498 = _img$12;
            var _img$26 = $498;
        };
        var self = _draw_d$9;
        if (self) {
            var _img$27 = (() => {
                var $500 = _img$26;
                var $501 = 0;
                var $502 = _rad$4;
                let _img$28 = $500;
                for (let _i$27 = $501; _i$27 < $502; ++_i$27) {
                    var _px$29 = _v3x$20;
                    var _py$30 = ((_v3y$21 + _i$27) >>> 0);
                    var $500 = ((_img$28.buffer[_img$28.length * 2] = ((0 | _px$29 | (_py$30 << 12) | (_cz$3 << 24))), _img$28.buffer[_img$28.length * 2 + 1] = _col$5, _img$28.length++, _img$28));
                    _img$28 = $500;
                };
                return _img$28;
            })();
            var $499 = _img$27;
            var _img$27 = $499;
        } else {
            var $503 = _img$26;
            var _img$27 = $503;
        };
        var self = _draw_b$7;
        if (self) {
            var _img$28 = (() => {
                var $505 = _img$27;
                var $506 = 0;
                var $507 = _rad$4;
                let _img$29 = $505;
                for (let _i$28 = $506; _i$28 < $507; ++_i$28) {
                    var _px$30 = ((_v2x$18 + _i$28) >>> 0);
                    var _py$31 = ((_v2y$19 + ((_i$28 / 2) >>> 0)) >>> 0);
                    var $505 = ((_img$29.buffer[_img$29.length * 2] = ((0 | _px$30 | (_py$31 << 12) | (_cz$3 << 24))), _img$29.buffer[_img$29.length * 2 + 1] = _col$5, _img$29.length++, _img$29));
                    _img$29 = $505;
                };
                return _img$29;
            })();
            var $504 = _img$28;
            var _img$28 = $504;
        } else {
            var $508 = _img$27;
            var _img$28 = $508;
        };
        var self = _draw_c$8;
        if (self) {
            var _img$29 = (() => {
                var $510 = _img$28;
                var $511 = 0;
                var $512 = _rad$4;
                let _img$30 = $510;
                for (let _i$29 = $511; _i$29 < $512; ++_i$29) {
                    var _px$31 = ((_v2x$18 - _i$29) >>> 0);
                    var _py$32 = ((_v2y$19 + ((_i$29 / 2) >>> 0)) >>> 0);
                    var $510 = ((_img$30.buffer[_img$30.length * 2] = ((0 | _px$31 | (_py$32 << 12) | (_cz$3 << 24))), _img$30.buffer[_img$30.length * 2 + 1] = _col$5, _img$30.length++, _img$30));
                    _img$30 = $510;
                };
                return _img$30;
            })();
            var $509 = _img$29;
            var _img$29 = $509;
        } else {
            var $513 = _img$28;
            var _img$29 = $513;
        };
        var self = _draw_f$11;
        if (self) {
            var _img$30 = (() => {
                var $515 = _img$29;
                var $516 = 0;
                var $517 = _rad$4;
                let _img$31 = $515;
                for (let _i$30 = $516; _i$30 < $517; ++_i$30) {
                    var _px$32 = ((((_v0x$14 - _i$30) >>> 0) - 1) >>> 0);
                    var _py$33 = ((_v0y$15 + ((_i$30 / 2) >>> 0)) >>> 0);
                    var $515 = ((_img$31.buffer[_img$31.length * 2] = ((0 | _px$32 | (_py$33 << 12) | (_cz$3 << 24))), _img$31.buffer[_img$31.length * 2 + 1] = _col$5, _img$31.length++, _img$31));
                    _img$31 = $515;
                };
                return _img$31;
            })();
            var $514 = _img$30;
            var _img$30 = $514;
        } else {
            var $518 = _img$29;
            var _img$30 = $518;
        };
        var self = _draw_e$10;
        if (self) {
            var _img$31 = (() => {
                var $520 = _img$30;
                var $521 = 0;
                var $522 = _rad$4;
                let _img$32 = $520;
                for (let _i$31 = $521; _i$31 < $522; ++_i$31) {
                    var _px$33 = ((((_v4x$22 + _i$31) >>> 0) + 1) >>> 0);
                    var _py$34 = ((_v4y$23 + ((_i$31 / 2) >>> 0)) >>> 0);
                    var $520 = ((_img$32.buffer[_img$32.length * 2] = ((0 | _px$33 | (_py$34 << 12) | (_cz$3 << 24))), _img$32.buffer[_img$32.length * 2 + 1] = _col$5, _img$32.length++, _img$32));
                    _img$32 = $520;
                };
                return _img$32;
            })();
            var $519 = _img$31;
            var _img$31 = $519;
        } else {
            var $523 = _img$30;
            var _img$31 = $523;
        };
        var $493 = _img$31;
        return $493;
    };
    const VoxBox$Draw$deresagon = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => x9 => x10 => x11 => VoxBox$Draw$deresagon$(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11);

    function Web$Kaelin$Draw$hexagon_border$(_cx$1, _cy$2, _rad$3, _col$4, _img$5) {
        var _img$6 = VoxBox$Draw$deresagon$(_cx$1, _cy$2, 0, _rad$3, _col$4, Bool$true, Bool$true, Bool$true, Bool$true, Bool$true, Bool$true, _img$5);
        var $524 = _img$6;
        return $524;
    };
    const Web$Kaelin$Draw$hexagon_border = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Draw$hexagon_border$(x0, x1, x2, x3, x4);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function List$imap$(_f$3, _xs$4) {
        var self = _xs$4;
        switch (self._) {
            case 'List.cons':
                var $526 = self.head;
                var $527 = self.tail;
                var $528 = List$cons$(_f$3(0n)($526), List$imap$((_n$7 => {
                    var $529 = _f$3(Nat$succ$(_n$7));
                    return $529;
                }), $527));
                var $525 = $528;
                break;
            case 'List.nil':
                var $530 = List$nil;
                var $525 = $530;
                break;
        };
        return $525;
    };
    const List$imap = x0 => x1 => List$imap$(x0, x1);

    function List$indices$u32$(_xs$2) {
        var $531 = List$imap$((_i$3 => _x$4 => {
            var $532 = Pair$new$((Number(_i$3) >>> 0), _x$4);
            return $532;
        }), _xs$2);
        return $531;
    };
    const List$indices$u32 = x0 => List$indices$u32$(x0);

    function String$to_list$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $534 = List$nil;
            var $533 = $534;
        } else {
            var $535 = self.charCodeAt(0);
            var $536 = self.slice(1);
            var $537 = List$cons$($535, String$to_list$($536));
            var $533 = $537;
        };
        return $533;
    };
    const String$to_list = x0 => String$to_list$(x0);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $539 = self.slice(0, -1);
                var $540 = (2n * Bits$to_nat$($539));
                var $538 = $540;
                break;
            case 'i':
                var $541 = self.slice(0, -1);
                var $542 = Nat$succ$((2n * Bits$to_nat$($541)));
                var $538 = $542;
                break;
            case 'e':
                var $543 = 0n;
                var $538 = $543;
                break;
        };
        return $538;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function U16$show_hex$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $545 = u16_to_word(self);
                var $546 = Nat$to_string_base$(16n, Bits$to_nat$(Word$to_bits$($545)));
                var $544 = $546;
                break;
        };
        return $544;
    };
    const U16$show_hex = x0 => U16$show_hex$(x0);

    function PixelFont$get_img$(_char$1, _map$2) {
        var self = Map$get$(U16$show_hex$(_char$1), _map$2);
        switch (self._) {
            case 'Maybe.some':
                var $548 = self.value;
                var $549 = Maybe$some$($548);
                var $547 = $549;
                break;
            case 'Maybe.none':
                var $550 = Maybe$none;
                var $547 = $550;
                break;
        };
        return $547;
    };
    const PixelFont$get_img = x0 => x1 => PixelFont$get_img$(x0, x1);

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $552 = self.pred;
                var $553 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $555 = self.pred;
                            var $556 = (_a$pred$9 => {
                                var $557 = Word$o$(Word$and$(_a$pred$9, $555));
                                return $557;
                            });
                            var $554 = $556;
                            break;
                        case 'Word.i':
                            var $558 = self.pred;
                            var $559 = (_a$pred$9 => {
                                var $560 = Word$o$(Word$and$(_a$pred$9, $558));
                                return $560;
                            });
                            var $554 = $559;
                            break;
                        case 'Word.e':
                            var $561 = (_a$pred$7 => {
                                var $562 = Word$e;
                                return $562;
                            });
                            var $554 = $561;
                            break;
                    };
                    var $554 = $554($552);
                    return $554;
                });
                var $551 = $553;
                break;
            case 'Word.i':
                var $563 = self.pred;
                var $564 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $566 = self.pred;
                            var $567 = (_a$pred$9 => {
                                var $568 = Word$o$(Word$and$(_a$pred$9, $566));
                                return $568;
                            });
                            var $565 = $567;
                            break;
                        case 'Word.i':
                            var $569 = self.pred;
                            var $570 = (_a$pred$9 => {
                                var $571 = Word$i$(Word$and$(_a$pred$9, $569));
                                return $571;
                            });
                            var $565 = $570;
                            break;
                        case 'Word.e':
                            var $572 = (_a$pred$7 => {
                                var $573 = Word$e;
                                return $573;
                            });
                            var $565 = $572;
                            break;
                    };
                    var $565 = $565($563);
                    return $565;
                });
                var $551 = $564;
                break;
            case 'Word.e':
                var $574 = (_b$4 => {
                    var $575 = Word$e;
                    return $575;
                });
                var $551 = $574;
                break;
        };
        var $551 = $551(_b$3);
        return $551;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);
    const Pos32$get_x = a0 => ((a0 & 0xFFF));
    const U32$shr = a0 => a1 => (a0 >>> a1);
    const Pos32$get_y = a0 => (((a0 >>> 12) & 0xFFF));
    const Pos32$get_z = a0 => ((a0 >>> 24));

    function VoxBox$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'VoxBox.new':
                var $577 = self.length;
                var $578 = $577;
                var $576 = $578;
                break;
        };
        return $576;
    };
    const VoxBox$get_len = x0 => VoxBox$get_len$(x0);

    function Array$get$(_idx$3, _arr$4) {
        var $579 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $581 = self.fst;
                    var $582 = _rec$6($581);
                    var $580 = $582;
                    break;
            };
            return $580;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $584 = self.snd;
                    var $585 = _rec$6($584);
                    var $583 = $585;
                    break;
            };
            return $583;
        }), _idx$3)(_arr$4);
        return $579;
    };
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => ((a1[a0]));
    const VoxBox$get_pos = a0 => a1 => ((a1.buffer[a0 * 2]));
    const VoxBox$get_col = a0 => a1 => ((a1.buffer[a0 * 2 + 1]));

    function VoxBox$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = VoxBox$get_len$(_src$4);
        var _img$7 = (() => {
            var $587 = _img$5;
            var $588 = 0;
            var $589 = _len$6;
            let _img$8 = $587;
            for (let _i$7 = $588; _i$7 < $589; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $587 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $587;
            };
            return _img$8;
        })();
        var $586 = _img$7;
        return $586;
    };
    const VoxBox$Draw$image = x0 => x1 => x2 => x3 => x4 => VoxBox$Draw$image$(x0, x1, x2, x3, x4);

    function VoxBox$Draw$text$char$(_chr$1, _font_map$2, _chr_pos$3, _scr$4) {
        var self = PixelFont$get_img$(_chr$1, _font_map$2);
        switch (self._) {
            case 'Maybe.some':
                var $591 = self.value;
                var _x$6 = ((_chr_pos$3 & 0xFFF));
                var _y$7 = (((_chr_pos$3 >>> 12) & 0xFFF));
                var _z$8 = ((_chr_pos$3 >>> 24));
                var $592 = VoxBox$Draw$image$(_x$6, _y$7, _z$8, $591, _scr$4);
                var $590 = $592;
                break;
            case 'Maybe.none':
                var $593 = _scr$4;
                var $590 = $593;
                break;
        };
        return $590;
    };
    const VoxBox$Draw$text$char = x0 => x1 => x2 => x3 => VoxBox$Draw$text$char$(x0, x1, x2, x3);

    function Pos32$add$(_a$1, _b$2) {
        var _x$3 = ((((_a$1 & 0xFFF)) + ((_b$2 & 0xFFF))) >>> 0);
        var _y$4 = (((((_a$1 >>> 12) & 0xFFF)) + (((_b$2 >>> 12) & 0xFFF))) >>> 0);
        var _z$5 = ((((_a$1 >>> 24)) + ((_b$2 >>> 24))) >>> 0);
        var $594 = ((0 | _x$3 | (_y$4 << 12) | (_z$5 << 24)));
        return $594;
    };
    const Pos32$add = x0 => x1 => Pos32$add$(x0, x1);

    function VoxBox$Draw$text$(_txt$1, _font_map$2, _pos$3, _scr$4) {
        var _scr$5 = (() => {
            var $597 = _scr$4;
            var $598 = List$indices$u32$(String$to_list$(_txt$1));
            let _scr$6 = $597;
            let _pair$5;
            while ($598._ === 'List.cons') {
                _pair$5 = $598.head;
                var self = _pair$5;
                switch (self._) {
                    case 'Pair.new':
                        var $599 = self.fst;
                        var $600 = self.snd;
                        var _add_pos$9 = ((0 | (($599 * 6) >>> 0) | (0 << 12) | (0 << 24)));
                        var $601 = VoxBox$Draw$text$char$($600, _font_map$2, Pos32$add$(_pos$3, _add_pos$9), _scr$6);
                        var $597 = $601;
                        break;
                };
                _scr$6 = $597;
                $598 = $598.tail;
            }
            return _scr$6;
        })();
        var $595 = _scr$5;
        return $595;
    };
    const VoxBox$Draw$text = x0 => x1 => x2 => x3 => VoxBox$Draw$text$(x0, x1, x2, x3);
    const Map$new = BitsMap$new;

    function PixelFont$set_img$(_char$1, _img$2, _map$3) {
        var $602 = Map$set$(U16$show_hex$(_char$1), _img$2, _map$3);
        return $602;
    };
    const PixelFont$set_img = x0 => x1 => x2 => PixelFont$set_img$(x0, x1, x2);

    function U16$new$(_value$1) {
        var $603 = word_to_u16(_value$1);
        return $603;
    };
    const U16$new = x0 => U16$new$(x0);
    const Nat$to_u16 = a0 => (Number(a0) & 0xFFFF);
    const PixelFont$small_black$100 = VoxBox$parse$("00001e21212801001e21212802001e21212800011e21212803011e21212800021e21212803021e21212800031e21212803031e21212800041e21212801041e21212802041e212128");
    const PixelFont$small_black$101 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212800011e21212800021e21212801021e21212802021e21212800031e21212800041e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$102 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212800011e21212800021e21212801021e21212802021e21212803021e21212800031e21212800041e212128");
    const PixelFont$small_black$103 = VoxBox$parse$("01001e21212802001e21212803001e21212800011e21212800021e21212802021e21212803021e21212800031e21212803031e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$104 = VoxBox$parse$("00001e21212803001e21212800011e21212803011e21212800021e21212801021e21212802021e21212803021e21212800031e21212803031e21212800041e21212803041e212128");
    const PixelFont$small_black$105 = VoxBox$parse$("01001e21212802001e21212803001e21212802011e21212802021e21212802031e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$106 = VoxBox$parse$("03001e21212803011e21212803021e21212800031e21212803031e21212801041e21212802041e212128");
    const PixelFont$small_black$107 = VoxBox$parse$("00001e21212803001e21212800011e21212802011e21212800021e21212801021e21212800031e21212802031e21212800041e21212803041e212128");
    const PixelFont$small_black$108 = VoxBox$parse$("00001e21212800011e21212800021e21212800031e21212800041e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$109 = VoxBox$parse$("00001e21212801001e21212803001e21212804001e21212800011e21212802011e21212804011e21212800021e21212804021e21212800031e21212804031e21212800041e21212804041e212128");
    const PixelFont$small_black$110 = VoxBox$parse$("00001e21212803001e21212800011e21212801011e21212803011e21212800021e21212802021e21212803021e21212800031e21212803031e21212800041e21212803041e212128");
    const PixelFont$small_black$111 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212800021e21212803021e21212800031e21212803031e21212801041e21212802041e212128");
    const PixelFont$small_black$112 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212800011e21212803011e21212800021e21212801021e21212802021e21212800031e21212800041e212128");
    const PixelFont$small_black$113 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212800021e21212803021e21212800031e21212803031e21212801041e21212802041e21212802051e21212803051e212128");
    const PixelFont$small_black$114 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212800011e21212803011e21212800021e21212801021e21212802021e21212800031e21212803031e21212800041e21212803041e212128");
    const PixelFont$small_black$115 = VoxBox$parse$("01001e21212802001e21212803001e21212800011e21212801021e21212802021e21212803031e21212800041e21212801041e21212802041e212128");
    const PixelFont$small_black$116 = VoxBox$parse$("01001e21212802001e21212803001e21212802011e21212802021e21212802031e21212802041e212128");
    const PixelFont$small_black$117 = VoxBox$parse$("00001e21212803001e21212800011e21212803011e21212800021e21212803021e21212800031e21212803031e21212801041e21212802041e212128");
    const PixelFont$small_black$118 = VoxBox$parse$("01001e21212803001e21212801011e21212803011e21212801021e21212803021e21212801031e21212803031e21212802041e212128");
    const PixelFont$small_black$119 = VoxBox$parse$("00001e21212804001e21212800011e21212804011e21212800021e21212802021e21212804021e21212800031e21212801031e21212803031e21212804031e21212800041e21212804041e212128");
    const PixelFont$small_black$120 = VoxBox$parse$("00001e21212804001e21212801011e21212803011e21212802021e21212801031e21212803031e21212800041e21212804041e212128");
    const PixelFont$small_black$121 = VoxBox$parse$("00001e21212804001e21212801011e21212803011e21212802021e21212802031e21212802041e212128");
    const PixelFont$small_black$122 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212803011e21212801021e21212802021e21212800031e21212800041e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$123 = VoxBox$parse$("02001e21212803001e21212802011e21212801021e21212802031e21212802041e21212803041e212128");
    const PixelFont$small_black$124 = VoxBox$parse$("02001e21212802011e21212802021e21212802031e21212802041e212128");
    const PixelFont$small_black$125 = VoxBox$parse$("01001e21212802001e21212802011e21212803021e21212802031e21212801041e21212802041e212128");
    const PixelFont$small_black$126 = VoxBox$parse$("01001e21212802001e21212804001e21212800011e21212802011e21212804011e21212800021e21212802021e21212803021e212128");
    const PixelFont$small_black$32 = VoxBox$parse$("");
    const PixelFont$small_black$33 = VoxBox$parse$("02001e21212802011e21212802021e21212802041e212128");
    const PixelFont$small_black$34 = VoxBox$parse$("01001e21212803001e21212801011e21212803011e212128");
    const PixelFont$small_black$35 = VoxBox$parse$("01001e21212803001e21212800011e21212801011e21212802011e21212803011e21212804011e21212801021e21212803021e21212800031e21212801031e21212802031e21212803031e21212804031e21212801041e21212803041e212128");
    const PixelFont$small_black$36 = VoxBox$parse$("01001e21212802001e21212803001e21212800011e21212800021e21212801021e21212802021e21212803021e21212804021e21212804031e21212801041e21212802041e21212803041e21212802051e212128");
    const PixelFont$small_black$37 = VoxBox$parse$("00001e21212801001e21212804001e21212803011e21212802021e21212801031e21212800041e21212803041e21212804041e212128");
    const PixelFont$small_black$38 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212801021e21212802021e21212804021e21212800031e21212803031e21212801041e21212802041e21212804041e212128");
    const PixelFont$small_black$39 = VoxBox$parse$("02001e21212802011e212128");
    const PixelFont$small_black$40 = VoxBox$parse$("03001e21212802011e21212802021e21212802031e21212803041e212128");
    const PixelFont$small_black$41 = VoxBox$parse$("01001e21212802011e21212802021e21212802031e21212801041e212128");
    const PixelFont$small_black$42 = VoxBox$parse$("01001e21212803001e21212802011e21212801021e21212803021e212128");
    const PixelFont$small_black$43 = VoxBox$parse$("02011e21212801021e21212802021e21212803021e21212802031e212128");
    const PixelFont$small_black$44 = VoxBox$parse$("01041e21212802041e21212802051e212128");
    const PixelFont$small_black$45 = VoxBox$parse$("01021e21212802021e21212803021e212128");
    const PixelFont$small_black$46 = VoxBox$parse$("02041e212128");
    const PixelFont$small_black$47 = VoxBox$parse$("03011e21212802021e21212801031e21212800041e212128");
    const PixelFont$small_black$48 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212800021e21212803021e21212800031e21212803031e21212801041e21212802041e212128");
    const PixelFont$small_black$49 = VoxBox$parse$("02001e21212801011e21212802011e21212802021e21212802031e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$50 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212802021e21212801031e21212800041e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$51 = VoxBox$parse$("00001e21212801001e21212802001e21212803011e21212801021e21212802021e21212803021e21212803031e21212800041e21212801041e21212802041e212128");
    const PixelFont$small_black$52 = VoxBox$parse$("00001e21212803001e21212800011e21212803011e21212800021e21212801021e21212802021e21212803021e21212803031e21212803041e212128");
    const PixelFont$small_black$53 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212800011e21212800021e21212801021e21212802021e21212803021e21212803031e21212800041e21212801041e21212802041e212128");
    const PixelFont$small_black$54 = VoxBox$parse$("01001e21212802001e21212803001e21212800011e21212800021e21212801021e21212802021e21212803021e21212800031e21212803031e21212801041e21212802041e212128");
    const PixelFont$small_black$55 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212803011e21212802021e21212801031e21212800041e212128");
    const PixelFont$small_black$56 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212801021e21212802021e21212800031e21212803031e21212801041e21212802041e212128");
    const PixelFont$small_black$57 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212801021e21212802021e21212803021e21212803031e21212800041e21212801041e21212802041e212128");
    const PixelFont$small_black$58 = VoxBox$parse$("02011e21212802031e212128");
    const PixelFont$small_black$59 = VoxBox$parse$("02011e21212801031e21212802031e21212802041e212128");
    const PixelFont$small_black$60 = VoxBox$parse$("03001e21212802011e21212801021e21212802031e21212803041e212128");
    const PixelFont$small_black$61 = VoxBox$parse$("01011e21212802011e21212803011e21212801031e21212802031e21212803031e212128");
    const PixelFont$small_black$62 = VoxBox$parse$("01001e21212802011e21212803021e21212802031e21212801041e212128");
    const PixelFont$small_black$63 = VoxBox$parse$("01001e21212802001e21212803001e21212803011e21212801021e21212802021e21212801041e212128");
    const PixelFont$small_black$64 = VoxBox$parse$("01001e21212802001e21212803001e21212800011e21212802011e21212803011e21212800021e21212802021e21212803021e21212800031e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$65 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212800021e21212801021e21212802021e21212803021e21212800031e21212803031e21212800041e21212803041e212128");
    const PixelFont$small_black$66 = VoxBox$parse$("00001e21212801001e21212802001e21212800011e21212803011e21212800021e21212801021e21212802021e21212800031e21212803031e21212800041e21212801041e21212802041e212128");
    const PixelFont$small_black$67 = VoxBox$parse$("01001e21212802001e21212803001e21212800011e21212800021e21212800031e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$68 = VoxBox$parse$("00001e21212801001e21212802001e21212800011e21212803011e21212800021e21212803021e21212800031e21212803031e21212800041e21212801041e21212802041e212128");
    const PixelFont$small_black$69 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212800011e21212800021e21212801021e21212802021e21212800031e21212800041e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$70 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212800011e21212800021e21212801021e21212802021e21212803021e21212800031e21212800041e212128");
    const PixelFont$small_black$71 = VoxBox$parse$("01001e21212802001e21212803001e21212800011e21212800021e21212802021e21212803021e21212800031e21212803031e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$72 = VoxBox$parse$("00001e21212803001e21212800011e21212803011e21212800021e21212801021e21212802021e21212803021e21212800031e21212803031e21212800041e21212803041e212128");
    const PixelFont$small_black$73 = VoxBox$parse$("01001e21212802001e21212803001e21212802011e21212802021e21212802031e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$74 = VoxBox$parse$("03001e21212803011e21212803021e21212800031e21212803031e21212801041e21212802041e212128");
    const PixelFont$small_black$75 = VoxBox$parse$("00001e21212803001e21212800011e21212802011e21212800021e21212801021e21212800031e21212802031e21212800041e21212803041e212128");
    const PixelFont$small_black$76 = VoxBox$parse$("00001e21212800011e21212800021e21212800031e21212800041e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$77 = VoxBox$parse$("00001e21212801001e21212803001e21212804001e21212800011e21212802011e21212804011e21212800021e21212804021e21212800031e21212804031e21212800041e21212804041e212128");
    const PixelFont$small_black$78 = VoxBox$parse$("00001e21212803001e21212800011e21212801011e21212803011e21212800021e21212802021e21212803021e21212800031e21212803031e21212800041e21212803041e212128");
    const PixelFont$small_black$79 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212800021e21212803021e21212800031e21212803031e21212801041e21212802041e212128");
    const PixelFont$small_black$80 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212800011e21212803011e21212800021e21212801021e21212802021e21212800031e21212800041e212128");
    const PixelFont$small_black$81 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212800021e21212803021e21212800031e21212803031e21212801041e21212802041e21212802051e21212803051e212128");
    const PixelFont$small_black$82 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212800011e21212803011e21212800021e21212801021e21212802021e21212800031e21212803031e21212800041e21212803041e212128");
    const PixelFont$small_black$83 = VoxBox$parse$("01001e21212802001e21212803001e21212800011e21212801021e21212802021e21212803031e21212800041e21212801041e21212802041e212128");
    const PixelFont$small_black$84 = VoxBox$parse$("01001e21212802001e21212803001e21212802011e21212802021e21212802031e21212802041e212128");
    const PixelFont$small_black$85 = VoxBox$parse$("00001e21212803001e21212800011e21212803011e21212800021e21212803021e21212800031e21212803031e21212801041e21212802041e212128");
    const PixelFont$small_black$86 = VoxBox$parse$("01001e21212803001e21212801011e21212803011e21212801021e21212803021e21212801031e21212803031e21212802041e212128");
    const PixelFont$small_black$87 = VoxBox$parse$("00001e21212804001e21212800011e21212804011e21212800021e21212802021e21212804021e21212800031e21212801031e21212803031e21212804031e21212800041e21212804041e212128");
    const PixelFont$small_black$88 = VoxBox$parse$("00001e21212804001e21212801011e21212803011e21212802021e21212801031e21212803031e21212800041e21212804041e212128");
    const PixelFont$small_black$89 = VoxBox$parse$("00001e21212804001e21212801011e21212803011e21212802021e21212802031e21212802041e212128");
    const PixelFont$small_black$90 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212803011e21212801021e21212802021e21212800031e21212800041e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$91 = VoxBox$parse$("01001e21212802001e21212801011e21212801021e21212801031e21212801041e21212802041e212128");
    const PixelFont$small_black$92 = VoxBox$parse$("01001e21212801011e21212802021e21212802031e21212803041e212128");
    const PixelFont$small_black$93 = VoxBox$parse$("02001e21212803001e21212803011e21212803021e21212803031e21212802041e21212803041e212128");
    const PixelFont$small_black$94 = VoxBox$parse$("02001e21212801011e21212803011e212128");
    const PixelFont$small_black$95 = VoxBox$parse$("00041e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$96 = VoxBox$parse$("00001e21212801011e21212802021e212128");
    const PixelFont$small_black$97 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212800021e21212801021e21212802021e21212803021e21212800031e21212803031e21212800041e21212803041e212128");
    const PixelFont$small_black$98 = VoxBox$parse$("00001e21212801001e21212802001e21212800011e21212803011e21212800021e21212801021e21212802021e21212800031e21212803031e21212800041e21212801041e21212802041e212128");
    const PixelFont$small_black$99 = VoxBox$parse$("01001e21212802001e21212803001e21212800011e21212800021e21212800031e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black = (() => {
        var _map$1 = Map$new;
        var _map$2 = PixelFont$set_img$(100, PixelFont$small_black$100, _map$1);
        var _map$3 = PixelFont$set_img$(101, PixelFont$small_black$101, _map$2);
        var _map$4 = PixelFont$set_img$(102, PixelFont$small_black$102, _map$3);
        var _map$5 = PixelFont$set_img$(103, PixelFont$small_black$103, _map$4);
        var _map$6 = PixelFont$set_img$(104, PixelFont$small_black$104, _map$5);
        var _map$7 = PixelFont$set_img$(105, PixelFont$small_black$105, _map$6);
        var _map$8 = PixelFont$set_img$(106, PixelFont$small_black$106, _map$7);
        var _map$9 = PixelFont$set_img$(107, PixelFont$small_black$107, _map$8);
        var _map$10 = PixelFont$set_img$(108, PixelFont$small_black$108, _map$9);
        var _map$11 = PixelFont$set_img$(109, PixelFont$small_black$109, _map$10);
        var _map$12 = PixelFont$set_img$(110, PixelFont$small_black$110, _map$11);
        var _map$13 = PixelFont$set_img$(111, PixelFont$small_black$111, _map$12);
        var _map$14 = PixelFont$set_img$(112, PixelFont$small_black$112, _map$13);
        var _map$15 = PixelFont$set_img$(113, PixelFont$small_black$113, _map$14);
        var _map$16 = PixelFont$set_img$(114, PixelFont$small_black$114, _map$15);
        var _map$17 = PixelFont$set_img$(115, PixelFont$small_black$115, _map$16);
        var _map$18 = PixelFont$set_img$(116, PixelFont$small_black$116, _map$17);
        var _map$19 = PixelFont$set_img$(117, PixelFont$small_black$117, _map$18);
        var _map$20 = PixelFont$set_img$(118, PixelFont$small_black$118, _map$19);
        var _map$21 = PixelFont$set_img$(119, PixelFont$small_black$119, _map$20);
        var _map$22 = PixelFont$set_img$(120, PixelFont$small_black$120, _map$21);
        var _map$23 = PixelFont$set_img$(121, PixelFont$small_black$121, _map$22);
        var _map$24 = PixelFont$set_img$(122, PixelFont$small_black$122, _map$23);
        var _map$25 = PixelFont$set_img$(123, PixelFont$small_black$123, _map$24);
        var _map$26 = PixelFont$set_img$(124, PixelFont$small_black$124, _map$25);
        var _map$27 = PixelFont$set_img$(125, PixelFont$small_black$125, _map$26);
        var _map$28 = PixelFont$set_img$(126, PixelFont$small_black$126, _map$27);
        var _map$29 = PixelFont$set_img$(32, PixelFont$small_black$32, _map$28);
        var _map$30 = PixelFont$set_img$(33, PixelFont$small_black$33, _map$29);
        var _map$31 = PixelFont$set_img$(34, PixelFont$small_black$34, _map$30);
        var _map$32 = PixelFont$set_img$(35, PixelFont$small_black$35, _map$31);
        var _map$33 = PixelFont$set_img$(36, PixelFont$small_black$36, _map$32);
        var _map$34 = PixelFont$set_img$(37, PixelFont$small_black$37, _map$33);
        var _map$35 = PixelFont$set_img$(38, PixelFont$small_black$38, _map$34);
        var _map$36 = PixelFont$set_img$(39, PixelFont$small_black$39, _map$35);
        var _map$37 = PixelFont$set_img$(40, PixelFont$small_black$40, _map$36);
        var _map$38 = PixelFont$set_img$(41, PixelFont$small_black$41, _map$37);
        var _map$39 = PixelFont$set_img$(42, PixelFont$small_black$42, _map$38);
        var _map$40 = PixelFont$set_img$(43, PixelFont$small_black$43, _map$39);
        var _map$41 = PixelFont$set_img$(44, PixelFont$small_black$44, _map$40);
        var _map$42 = PixelFont$set_img$(45, PixelFont$small_black$45, _map$41);
        var _map$43 = PixelFont$set_img$(46, PixelFont$small_black$46, _map$42);
        var _map$44 = PixelFont$set_img$(47, PixelFont$small_black$47, _map$43);
        var _map$45 = PixelFont$set_img$(48, PixelFont$small_black$48, _map$44);
        var _map$46 = PixelFont$set_img$(49, PixelFont$small_black$49, _map$45);
        var _map$47 = PixelFont$set_img$(50, PixelFont$small_black$50, _map$46);
        var _map$48 = PixelFont$set_img$(51, PixelFont$small_black$51, _map$47);
        var _map$49 = PixelFont$set_img$(52, PixelFont$small_black$52, _map$48);
        var _map$50 = PixelFont$set_img$(53, PixelFont$small_black$53, _map$49);
        var _map$51 = PixelFont$set_img$(54, PixelFont$small_black$54, _map$50);
        var _map$52 = PixelFont$set_img$(55, PixelFont$small_black$55, _map$51);
        var _map$53 = PixelFont$set_img$(56, PixelFont$small_black$56, _map$52);
        var _map$54 = PixelFont$set_img$(57, PixelFont$small_black$57, _map$53);
        var _map$55 = PixelFont$set_img$(58, PixelFont$small_black$58, _map$54);
        var _map$56 = PixelFont$set_img$(59, PixelFont$small_black$59, _map$55);
        var _map$57 = PixelFont$set_img$(60, PixelFont$small_black$60, _map$56);
        var _map$58 = PixelFont$set_img$(61, PixelFont$small_black$61, _map$57);
        var _map$59 = PixelFont$set_img$(62, PixelFont$small_black$62, _map$58);
        var _map$60 = PixelFont$set_img$(63, PixelFont$small_black$63, _map$59);
        var _map$61 = PixelFont$set_img$(64, PixelFont$small_black$64, _map$60);
        var _map$62 = PixelFont$set_img$(65, PixelFont$small_black$65, _map$61);
        var _map$63 = PixelFont$set_img$(66, PixelFont$small_black$66, _map$62);
        var _map$64 = PixelFont$set_img$(67, PixelFont$small_black$67, _map$63);
        var _map$65 = PixelFont$set_img$(68, PixelFont$small_black$68, _map$64);
        var _map$66 = PixelFont$set_img$(69, PixelFont$small_black$69, _map$65);
        var _map$67 = PixelFont$set_img$(70, PixelFont$small_black$70, _map$66);
        var _map$68 = PixelFont$set_img$(71, PixelFont$small_black$71, _map$67);
        var _map$69 = PixelFont$set_img$(72, PixelFont$small_black$72, _map$68);
        var _map$70 = PixelFont$set_img$(73, PixelFont$small_black$73, _map$69);
        var _map$71 = PixelFont$set_img$(74, PixelFont$small_black$74, _map$70);
        var _map$72 = PixelFont$set_img$(75, PixelFont$small_black$75, _map$71);
        var _map$73 = PixelFont$set_img$(76, PixelFont$small_black$76, _map$72);
        var _map$74 = PixelFont$set_img$(77, PixelFont$small_black$77, _map$73);
        var _map$75 = PixelFont$set_img$(78, PixelFont$small_black$78, _map$74);
        var _map$76 = PixelFont$set_img$(79, PixelFont$small_black$79, _map$75);
        var _map$77 = PixelFont$set_img$(80, PixelFont$small_black$80, _map$76);
        var _map$78 = PixelFont$set_img$(81, PixelFont$small_black$81, _map$77);
        var _map$79 = PixelFont$set_img$(82, PixelFont$small_black$82, _map$78);
        var _map$80 = PixelFont$set_img$(83, PixelFont$small_black$83, _map$79);
        var _map$81 = PixelFont$set_img$(84, PixelFont$small_black$84, _map$80);
        var _map$82 = PixelFont$set_img$(85, PixelFont$small_black$85, _map$81);
        var _map$83 = PixelFont$set_img$(86, PixelFont$small_black$86, _map$82);
        var _map$84 = PixelFont$set_img$(87, PixelFont$small_black$87, _map$83);
        var _map$85 = PixelFont$set_img$(88, PixelFont$small_black$88, _map$84);
        var _map$86 = PixelFont$set_img$(89, PixelFont$small_black$89, _map$85);
        var _map$87 = PixelFont$set_img$(90, PixelFont$small_black$90, _map$86);
        var _map$88 = PixelFont$set_img$(91, PixelFont$small_black$91, _map$87);
        var _map$89 = PixelFont$set_img$(92, PixelFont$small_black$92, _map$88);
        var _map$90 = PixelFont$set_img$(93, PixelFont$small_black$93, _map$89);
        var _map$91 = PixelFont$set_img$(94, PixelFont$small_black$94, _map$90);
        var _map$92 = PixelFont$set_img$(95, PixelFont$small_black$95, _map$91);
        var _map$93 = PixelFont$set_img$(96, PixelFont$small_black$96, _map$92);
        var _map$94 = PixelFont$set_img$(97, PixelFont$small_black$97, _map$93);
        var _map$95 = PixelFont$set_img$(98, PixelFont$small_black$98, _map$94);
        var _map$96 = PixelFont$set_img$(99, PixelFont$small_black$99, _map$95);
        var $604 = _map$96;
        return $604;
    })();

    function Web$Kaelin$Draw$tile$empty$(_coord$1, _map$2, _img$3) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $606 = self.i;
                var $607 = self.j;
                var self = Web$Kaelin$Coord$to_screen_xy$(_coord$1);
                switch (self._) {
                    case 'Pair.new':
                        var $609 = self.fst;
                        var $610 = self.snd;
                        var _cx$8 = (((($609 - Web$Kaelin$Resources$hexagon_radius) >>> 0) + 3) >>> 0);
                        var _str$9 = (Int$show$($606) + Int$show$($607));
                        var $611 = VoxBox$Draw$text$(_str$9, PixelFont$small_black, ((0 | _cx$8 | ($610 << 12) | (0 << 24))), _img$3);
                        var $608 = $611;
                        break;
                };
                var $605 = $608;
                break;
        };
        return $605;
    };
    const Web$Kaelin$Draw$tile$empty = x0 => x1 => x2 => Web$Kaelin$Draw$tile$empty$(x0, x1, x2);

    function Web$Kaelin$Map$get$(_coord$1, _map$2) {
        var $612 = Maybe$default$(Map$get$(Web$Kaelin$Coord$show$(_coord$1), _map$2), List$nil);
        return $612;
    };
    const Web$Kaelin$Map$get = x0 => x1 => Web$Kaelin$Map$get$(x0, x1);

    function Web$Kaelin$Draw$tile$(_coord$1, _map$2, _img$3) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var self = Web$Kaelin$Coord$to_screen_xy$(_coord$1);
                switch (self._) {
                    case 'Pair.new':
                        var $615 = self.fst;
                        var $616 = self.snd;
                        var _tile$8 = Web$Kaelin$Map$get$(_coord$1, _map$2);
                        var _img$9 = (() => {
                            var $619 = _img$3;
                            var $620 = _tile$8;
                            let _img$10 = $619;
                            let _ent$9;
                            while ($620._ === 'List.cons') {
                                _ent$9 = $620.head;
                                var _cx$11 = (($615 - Web$Kaelin$Resources$hexagon_radius) >>> 0);
                                var self = _ent$9;
                                switch (self._) {
                                    case 'Web.Kaelin.Entity.background':
                                        var $621 = self.img;
                                        var _cy$13 = (($616 - Web$Kaelin$Resources$hexagon_radius) >>> 0);
                                        var $622 = VoxBox$Draw$image$(_cx$11, _cy$13, 0, $621, _img$10);
                                        var $619 = $622;
                                        break;
                                    case 'Web.Kaelin.Entity.char':
                                        var $623 = self.img;
                                        var _aux_y$13 = ((Web$Kaelin$Resources$hexagon_radius * 2) >>> 0);
                                        var _cy$14 = (($616 - _aux_y$13) >>> 0);
                                        var $624 = VoxBox$Draw$image$(_cx$11, _cy$14, 0, $623, _img$10);
                                        var $619 = $624;
                                        break;
                                };
                                _img$10 = $619;
                                $620 = $620.tail;
                            }
                            return _img$10;
                        })();
                        var $617 = _img$9;
                        var $614 = $617;
                        break;
                };
                var $613 = $614;
                break;
        };
        return $613;
    };
    const Web$Kaelin$Draw$tile = x0 => x1 => x2 => Web$Kaelin$Draw$tile$(x0, x1, x2);

    function Web$Kaelin$Draw$map$(_img$1, _map$2) {
        var _img$3 = VoxBox$clear$(_img$1);
        var _col$4 = ((0 | 0 | (0 << 8) | (255 << 16) | (255 << 24)));
        var _map_size$5 = Web$Kaelin$Resources$map_size;
        var _width$6 = ((((_map_size$5 * 2) >>> 0) + 1) >>> 0);
        var _height$7 = ((((_map_size$5 * 2) >>> 0) + 1) >>> 0);
        var _hex_rad$8 = Web$Kaelin$Resources$hexagon_radius;
        var _img$9 = (() => {
            var $626 = _img$3;
            var $627 = 0;
            var $628 = _height$7;
            let _img$10 = $626;
            for (let _j$9 = $627; _j$9 < $628; ++_j$9) {
                var _img$11 = (() => {
                    var $629 = _img$10;
                    var $630 = 0;
                    var $631 = _width$6;
                    let _img$12 = $629;
                    for (let _i$11 = $630; _i$11 < $631; ++_i$11) {
                        var _coord_i$13 = ((0n - (BigInt(_i$11))) - (0n - (BigInt(_map_size$5))));
                        var _coord_j$14 = ((0n - (BigInt(_j$9))) - (0n - (BigInt(_map_size$5))));
                        var _coord$15 = Web$Kaelin$Coord$new$(_coord_i$13, _coord_j$14);
                        var _fit$16 = Web$Kaelin$Coord$fit$(_coord$15, _map_size$5);
                        var self = _fit$16;
                        if (self) {
                            var _map$17 = Web$Kaelin$Draw$background$(_coord$15, _map$2);
                            var self = Web$Kaelin$Coord$to_screen_xy$(_coord$15);
                            switch (self._) {
                                case 'Pair.new':
                                    var $633 = self.fst;
                                    var $634 = self.snd;
                                    var _img$20 = Web$Kaelin$Draw$hexagon_border$($633, $634, _hex_rad$8, _col$4, _img$12);
                                    var _img$21 = Web$Kaelin$Draw$tile$empty$(_coord$15, _map$17, _img$20);
                                    var _img$22 = Web$Kaelin$Draw$tile$(_coord$15, _map$17, _img$21);
                                    var $635 = _img$22;
                                    var $632 = $635;
                                    break;
                            };
                            var $629 = $632;
                        } else {
                            var $636 = _img$12;
                            var $629 = $636;
                        };
                        _img$12 = $629;
                    };
                    return _img$12;
                })();
                var $626 = _img$11;
                _img$10 = $626;
            };
            return _img$10;
        })();
        var $625 = _img$9;
        return $625;
    };
    const Web$Kaelin$Draw$map = x0 => x1 => Web$Kaelin$Draw$map$(x0, x1);

    function BitsMap$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $638 = self.val;
                var $639 = self.lft;
                var $640 = self.rgt;
                var self = $638;
                switch (self._) {
                    case 'Maybe.some':
                        var $642 = self.value;
                        var $643 = List$cons$($642, _list$3);
                        var _list0$7 = $643;
                        break;
                    case 'Maybe.none':
                        var $644 = _list$3;
                        var _list0$7 = $644;
                        break;
                };
                var _list1$8 = BitsMap$values$go$($639, _list0$7);
                var _list2$9 = BitsMap$values$go$($640, _list1$8);
                var $641 = _list2$9;
                var $637 = $641;
                break;
            case 'BitsMap.new':
                var $645 = _list$3;
                var $637 = $645;
                break;
        };
        return $637;
    };
    const BitsMap$values$go = x0 => x1 => BitsMap$values$go$(x0, x1);

    function Map$values$(_xs$2) {
        var $646 = BitsMap$values$go$(_xs$2, List$nil);
        return $646;
    };
    const Map$values = x0 => Map$values$(x0);
    const U16$eql = a0 => a1 => (a0 === a1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Web$Kaelin$Draw$state$player$(_img$1, _player$2) {
        var self = _player$2;
        switch (self._) {
            case 'Web.Kaelin.Player.new':
                var $648 = self.coord;
                var $649 = self.hero;
                var self = Web$Kaelin$Coord$to_screen_xy$($648);
                switch (self._) {
                    case 'Pair.new':
                        var $651 = self.fst;
                        var $652 = self.snd;
                        var self = ($649 === "croni");
                        if (self) {
                            var $654 = Web$Kaelin$Entity$char$(Kaelin$Assets$chars$croni0_d_1);
                            var _ent$7 = $654;
                        } else {
                            var $655 = Web$Kaelin$Entity$char$(Kaelin$Assets$chars$cyclope_d_1);
                            var _ent$7 = $655;
                        };
                        var self = _ent$7;
                        switch (self._) {
                            case 'Web.Kaelin.Entity.background':
                                var $656 = self.img;
                                var $657 = VoxBox$Draw$image$($651, $652, 0, $656, _img$1);
                                var $653 = $657;
                                break;
                            case 'Web.Kaelin.Entity.char':
                                var $658 = self.img;
                                var $659 = VoxBox$Draw$image$($651, $652, 0, $658, _img$1);
                                var $653 = $659;
                                break;
                        };
                        var $650 = $653;
                        break;
                };
                var $647 = $650;
                break;
        };
        return $647;
    };
    const Web$Kaelin$Draw$state$player = x0 => x1 => Web$Kaelin$Draw$state$player$(x0, x1);

    function Web$Kaelin$Draw$state$players$(_img$1, _players$2) {
        var _players_list$3 = Map$values$(_players$2);
        var _img$4 = (() => {
            var $662 = _img$1;
            var $663 = _players_list$3;
            let _img$5 = $662;
            let _player$4;
            while ($663._ === 'List.cons') {
                _player$4 = $663.head;
                var $662 = Web$Kaelin$Draw$state$player$(_img$5, _player$4);
                _img$5 = $662;
                $663 = $663.tail;
            }
            return _img$5;
        })();
        var $660 = _img$4;
        return $660;
    };
    const Web$Kaelin$Draw$state$players = x0 => x1 => Web$Kaelin$Draw$state$players$(x0, x1);

    function Web$Kaelin$Draw$state$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $665 = self.players;
                var _new_img$8 = Web$Kaelin$Draw$state$players$(_img$1, $665);
                var $666 = _new_img$8;
                var $664 = $666;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $667 = _img$1;
                var $664 = $667;
                break;
        };
        return $664;
    };
    const Web$Kaelin$Draw$state = x0 => x1 => Web$Kaelin$Draw$state$(x0, x1);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $668 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $668;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);

    function IO$(_A$1) {
        var $669 = null;
        return $669;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $670 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $670;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $672 = self.value;
                var $673 = _f$4($672);
                var $671 = $673;
                break;
            case 'IO.ask':
                var $674 = self.query;
                var $675 = self.param;
                var $676 = self.then;
                var $677 = IO$ask$($674, $675, (_x$8 => {
                    var $678 = IO$bind$($676(_x$8), _f$4);
                    return $678;
                }));
                var $671 = $677;
                break;
        };
        return $671;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $679 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $679;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $680 = _new$2(IO$bind)(IO$end);
        return $680;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $681 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $681;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $682 = _m$pure$2;
        return $682;
    }))(Dynamic$new$(Unit$new));

    function IO$put_string$(_text$1) {
        var $683 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $684 = IO$end$(Unit$new);
            return $684;
        }));
        return $683;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function IO$print$(_text$1) {
        var $685 = IO$put_string$((_text$1 + "\u{a}"));
        return $685;
    };
    const IO$print = x0 => IO$print$(x0);

    function App$print$(_str$1) {
        var $686 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $687 = _m$bind$2;
            return $687;
        }))(IO$print$(_str$1))((_$2 => {
            var $688 = App$pass;
            return $688;
        }));
        return $686;
    };
    const App$print = x0 => App$print$(x0);

    function IO$do$(_call$1, _param$2) {
        var $689 = IO$ask$(_call$1, _param$2, (_answer$3 => {
            var $690 = IO$end$(Unit$new);
            return $690;
        }));
        return $689;
    };
    const IO$do = x0 => x1 => IO$do$(x0, x1);

    function App$do$(_call$1, _param$2) {
        var $691 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $692 = _m$bind$3;
            return $692;
        }))(IO$do$(_call$1, _param$2))((_$3 => {
            var $693 = App$pass;
            return $693;
        }));
        return $691;
    };
    const App$do = x0 => x1 => App$do$(x0, x1);

    function App$watch$(_room$1) {
        var $694 = App$do$("watch", _room$1);
        return $694;
    };
    const App$watch = x0 => App$watch$(x0);

    function App$store$(_value$2) {
        var $695 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $696 = _m$pure$4;
            return $696;
        }))(Dynamic$new$(_value$2));
        return $695;
    };
    const App$store = x0 => App$store$(x0);

    function Web$Kaelin$Action$update_interface$(_interface$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $698 = self.room;
                var $699 = self.tick;
                var $700 = self.players;
                var $701 = self.map;
                var $702 = Web$Kaelin$State$game$($698, $699, $700, $701, _interface$1);
                var $697 = $702;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $703 = _state$2;
                var $697 = $703;
                break;
        };
        return $697;
    };
    const Web$Kaelin$Action$update_interface = x0 => x1 => Web$Kaelin$Action$update_interface$(x0, x1);

    function Pair$show$(_show_a$3, _show_b$4, _pair$5) {
        var self = _pair$5;
        switch (self._) {
            case 'Pair.new':
                var $705 = self.fst;
                var $706 = self.snd;
                var _str$8 = ("(" + _show_a$3($705));
                var _str$9 = (_str$8 + ",");
                var _str$10 = (_str$9 + _show_b$4($706));
                var _str$11 = (_str$10 + ")");
                var $707 = _str$11;
                var $704 = $707;
                break;
        };
        return $704;
    };
    const Pair$show = x0 => x1 => x2 => Pair$show$(x0, x1, x2);

    function Word$show$(_a$2) {
        var _n$3 = Word$to_nat$(_a$2);
        var $708 = (Nat$show$(_n$3) + ("#" + Nat$show$(_size$1)));
        return $708;
    };
    const Word$show = x0 => Word$show$(x0);
    const U32$show = a0 => (a0 + "#32");

    function App$post$(_room$1, _data$2) {
        var $709 = App$do$("post", (_room$1 + (";" + _data$2)));
        return $709;
    };
    const App$post = x0 => x1 => App$post$(x0, x1);

    function Web$Kaelin$Command$create_hero$(_hero_name$1) {
        var self = (_hero_name$1 === "croni");
        if (self) {
            var $711 = "0x1000000000000000000000000000000000000000000000000000000000000001";
            var $710 = $711;
        } else {
            var $712 = "0x0000000000000000000000000000000000000000000000000000000000000000";
            var $710 = $712;
        };
        return $710;
    };
    const Web$Kaelin$Command$create_hero = x0 => Web$Kaelin$Command$create_hero$(x0);
    const Debug$log = a0 => a1 => ((console.log(a0), a1()));

    function Char$eql$(_a$1, _b$2) {
        var $713 = (_a$1 === _b$2);
        return $713;
    };
    const Char$eql = x0 => x1 => Char$eql$(x0, x1);

    function String$starts_with$(_xs$1, _match$2) {
        var String$starts_with$ = (_xs$1, _match$2) => ({
            ctr: 'TCO',
            arg: [_xs$1, _match$2]
        });
        var String$starts_with = _xs$1 => _match$2 => String$starts_with$(_xs$1, _match$2);
        var arg = [_xs$1, _match$2];
        while (true) {
            let [_xs$1, _match$2] = arg;
            var R = (() => {
                var self = _match$2;
                if (self.length === 0) {
                    var $714 = Bool$true;
                    return $714;
                } else {
                    var $715 = self.charCodeAt(0);
                    var $716 = self.slice(1);
                    var self = _xs$1;
                    if (self.length === 0) {
                        var $718 = Bool$false;
                        var $717 = $718;
                    } else {
                        var $719 = self.charCodeAt(0);
                        var $720 = self.slice(1);
                        var self = Char$eql$($715, $719);
                        if (self) {
                            var $722 = String$starts_with$($720, $716);
                            var $721 = $722;
                        } else {
                            var $723 = Bool$false;
                            var $721 = $723;
                        };
                        var $717 = $721;
                    };
                    return $717;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$starts_with = x0 => x1 => String$starts_with$(x0, x1);

    function Web$Kaelin$Player$new$(_coord$1, _hero$2) {
        var $724 = ({
            _: 'Web.Kaelin.Player.new',
            'coord': _coord$1,
            'hero': _hero$2
        });
        return $724;
    };
    const Web$Kaelin$Player$new = x0 => x1 => Web$Kaelin$Player$new$(x0, x1);

    function Web$Kaelin$Action$create_player$(_user$1, _hero_name$2, _state$3) {
        var _key$4 = _user$1;
        var _init_pos$5 = Web$Kaelin$Coord$new$((0n - 0n), (1n - 0n));
        var self = _state$3;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $726 = self.room;
                var $727 = self.tick;
                var $728 = self.players;
                var $729 = self.map;
                var $730 = self.interface;
                var self = Map$get$(_key$4, $728);
                switch (self._) {
                    case 'Maybe.none':
                        var _new_player$11 = Web$Kaelin$Player$new$(_init_pos$5, _hero_name$2);
                        var _new_players$12 = Map$set$(_key$4, _new_player$11, $728);
                        var $732 = Web$Kaelin$State$game$($726, $727, _new_players$12, $729, $730);
                        var $731 = $732;
                        break;
                    case 'Maybe.some':
                        var $733 = _state$3;
                        var $731 = $733;
                        break;
                };
                var $725 = $731;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $734 = _state$3;
                var $725 = $734;
                break;
        };
        return $725;
    };
    const Web$Kaelin$Action$create_player = x0 => x1 => x2 => Web$Kaelin$Action$create_player$(x0, x1, x2);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $735 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $735;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Kaelin = (() => {
        var _img$1 = VoxBox$alloc_capacity$(65536);
        var _map$2 = Map$from_list$(List$nil);
        var _map$3 = Web$Kaelin$Draw$initial_ent$(_map$2);
        var _init$2 = Web$Kaelin$State$game$(Web$Kaelin$Resources$room, 0n, Map$from_list$(List$nil), _map$3, App$EnvInfo$new$(Pair$new$(0, 0), Pair$new$(0, 0)));
        var _draw$3 = (_state$3 => {
            var self = _state$3;
            switch (self._) {
                case 'Web.Kaelin.State.game':
                    var $738 = self.map;
                    var _img$9 = Web$Kaelin$Draw$map$(_img$1, $738);
                    var _img$10 = Web$Kaelin$Draw$state$(_img$9, _state$3);
                    var $739 = DOM$vbox$(Map$from_list$(List$nil), Map$from_list$(List$nil), _img$10);
                    var $737 = $739;
                    break;
                case 'Web.Kaelin.State.init':
                case 'Web.Kaelin.State.void':
                    var $740 = DOM$text$("TODO: create the renderer for this game state mode");
                    var $737 = $740;
                    break;
            };
            return $737;
        });
        var _when$4 = (_event$4 => _state$5 => {
            var self = _event$4;
            switch (self._) {
                case 'App.Event.tick':
                    var $742 = self.info;
                    var self = _state$5;
                    switch (self._) {
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                            var $744 = App$pass;
                            var $743 = $744;
                            break;
                        case 'Web.Kaelin.State.game':
                            var _info$13 = $742;
                            var $745 = App$store$(Web$Kaelin$Action$update_interface$(_info$13, _state$5));
                            var $743 = $745;
                            break;
                    };
                    var $741 = $743;
                    break;
                case 'App.Event.key_down':
                    var $746 = self.code;
                    var self = _state$5;
                    switch (self._) {
                        case 'Web.Kaelin.State.game':
                            var $748 = self.room;
                            var self = ($746 === 48);
                            if (self) {
                                var $750 = App$post$($748, Web$Kaelin$Command$create_hero$("croni"));
                                var $749 = $750;
                            } else {
                                var $751 = App$pass;
                                var $749 = $751;
                            };
                            var $747 = $749;
                            break;
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                            var $752 = App$pass;
                            var $747 = $752;
                            break;
                    };
                    var $741 = $747;
                    break;
                case 'App.Event.post':
                    var $753 = self.addr;
                    var $754 = self.data;
                    var self = _state$5;
                    switch (self._) {
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                            var $756 = App$pass;
                            var $755 = $756;
                            break;
                        case 'Web.Kaelin.State.game':
                            var $757 = ((console.log(($754 + String$nil)), (_x$15 => {
                                var self = String$starts_with$($754, "0x1");
                                if (self) {
                                    var $759 = App$store$(Web$Kaelin$Action$create_player$($753, "croni", _state$5));
                                    var $758 = $759;
                                } else {
                                    var $760 = App$pass;
                                    var $758 = $760;
                                };
                                return $758;
                            })()));
                            var $755 = $757;
                            break;
                    };
                    var $741 = $755;
                    break;
                case 'App.Event.init':
                    var self = _state$5;
                    switch (self._) {
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                            var $762 = App$pass;
                            var $761 = $762;
                            break;
                        case 'Web.Kaelin.State.game':
                            var $763 = IO$monad$((_m$bind$14 => _m$pure$15 => {
                                var $764 = _m$bind$14;
                                return $764;
                            }))(App$print$("Kaelin started!!!"))((_$14 => {
                                var $765 = App$watch$(Web$Kaelin$Resources$room);
                                return $765;
                            }));
                            var $761 = $763;
                            break;
                    };
                    var $741 = $761;
                    break;
                case 'App.Event.dom':
                    var self = _state$5;
                    switch (self._) {
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                        case 'Web.Kaelin.State.game':
                            var $767 = App$pass;
                            var $766 = $767;
                            break;
                    };
                    var $741 = $766;
                    break;
                case 'App.Event.mouse_down':
                case 'App.Event.key_up':
                    var self = _state$5;
                    switch (self._) {
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                        case 'Web.Kaelin.State.game':
                            var $769 = App$pass;
                            var $768 = $769;
                            break;
                    };
                    var $741 = $768;
                    break;
                case 'App.Event.mouse_up':
                    var self = _state$5;
                    switch (self._) {
                        case 'Web.Kaelin.State.game':
                            var $771 = self.interface;
                            var _info$13 = $771;
                            var self = _info$13;
                            switch (self._) {
                                case 'App.EnvInfo.new':
                                    var $773 = self.mouse_pos;
                                    var _pos$16 = $773;
                                    var self = _pos$16;
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $775 = self.fst;
                                            var $776 = self.snd;
                                            var self = Pair$new$((($775 / 2) >>> 0), (($776 / 2) >>> 0));
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $778 = self.fst;
                                                    var $779 = self.snd;
                                                    var $780 = App$print$(Pair$show$(U32$show, U32$show, Pair$new$($778, $779)));
                                                    var $777 = $780;
                                                    break;
                                            };
                                            var $774 = $777;
                                            break;
                                    };
                                    var $772 = $774;
                                    break;
                            };
                            var $770 = $772;
                            break;
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                            var $781 = App$pass;
                            var $770 = $781;
                            break;
                    };
                    var $741 = $770;
                    break;
            };
            return $741;
        });
        var $736 = App$new$(_init$2, _draw$3, _when$4);
        return $736;
    })();
    return {
        'Buffer32.new': Buffer32$new,
        'Array': Array,
        'Array.tip': Array$tip,
        'Array.tie': Array$tie,
        'Array.alloc': Array$alloc,
        'U32.new': U32$new,
        'Word': Word,
        'Word.e': Word$e,
        'Word.o': Word$o,
        'Word.zero': Word$zero,
        'Nat.succ': Nat$succ,
        'Nat.zero': Nat$zero,
        'U32.zero': U32$zero,
        'Buffer32.alloc': Buffer32$alloc,
        'Word.bit_length.go': Word$bit_length$go,
        'Word.bit_length': Word$bit_length,
        'U32.bit_length': U32$bit_length,
        'Word.i': Word$i,
        'Bool.false': Bool$false,
        'Bool.true': Bool$true,
        'Word.shift_left1.aux': Word$shift_left1$aux,
        'Word.shift_left1': Word$shift_left1,
        'Word.adder': Word$adder,
        'Word.add': Word$add,
        'Word.mul.go': Word$mul$go,
        'Word.to_zero': Word$to_zero,
        'Word.mul': Word$mul,
        'U32.mul': U32$mul,
        'Nat.apply': Nat$apply,
        'Word.inc': Word$inc,
        'Nat.to_word': Nat$to_word,
        'Nat.to_u32': Nat$to_u32,
        'VoxBox.new': VoxBox$new,
        'VoxBox.alloc_capacity': VoxBox$alloc_capacity,
        'BitsMap': BitsMap,
        'Map': Map,
        'BitsMap.new': BitsMap$new,
        'BitsMap.tie': BitsMap$tie,
        'Maybe.some': Maybe$some,
        'Maybe.none': Maybe$none,
        'BitsMap.set': BitsMap$set,
        'Bits.e': Bits$e,
        'Bits.o': Bits$o,
        'Bits.i': Bits$i,
        'Bits.concat': Bits$concat,
        'Word.to_bits': Word$to_bits,
        'U16.to_bits': U16$to_bits,
        'String.to_bits': String$to_bits,
        'Map.from_list': Map$from_list,
        'List': List,
        'List.nil': List$nil,
        'Pair': Pair,
        'Web.Kaelin.Entity.char': Web$Kaelin$Entity$char,
        'Nat.ltn': Nat$ltn,
        'Nat.sub': Nat$sub,
        'Word.shift_left': Word$shift_left,
        'Cmp.as_gte': Cmp$as_gte,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.gte': Word$gte,
        'Pair.new': Pair$new,
        'Word.or': Word$or,
        'Word.shift_right1.aux': Word$shift_right1$aux,
        'Word.shift_right1': Word$shift_right1,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'Word.div.go': Word$div$go,
        'Word.div': Word$div,
        'U32.div': U32$div,
        'U32.length': U32$length,
        'Cmp.as_eql': Cmp$as_eql,
        'Word.eql': Word$eql,
        'U32.eql': U32$eql,
        'U32.inc': U32$inc,
        'U32.for': U32$for,
        'Word.slice': Word$slice,
        'U32.slice': U32$slice,
        'U32.add': U32$add,
        'U32.read_base': U32$read_base,
        'VoxBox.parse_byte': VoxBox$parse_byte,
        'U32.or': U32$or,
        'U32.shl': U32$shl,
        'Pos32.new': Pos32$new,
        'Col32.new': Col32$new,
        'Word.trim': Word$trim,
        'Unit.new': Unit$new,
        'Array.extract_tip': Array$extract_tip,
        'Array.extract_tie': Array$extract_tie,
        'Word.foldl': Word$foldl,
        'Array.mut': Array$mut,
        'Array.set': Array$set,
        'Buffer32.set': Buffer32$set,
        'VoxBox.set_pos': VoxBox$set_pos,
        'VoxBox.set_col': VoxBox$set_col,
        'VoxBox.set_length': VoxBox$set_length,
        'VoxBox.push': VoxBox$push,
        'VoxBox.parse': VoxBox$parse,
        'Kaelin.Assets.chars.croni0_d_1': Kaelin$Assets$chars$croni0_d_1,
        'Kaelin.Assets.chars.cyclope_d_1': Kaelin$Assets$chars$cyclope_d_1,
        'Kaelin.Assets.chars.lela_d_1': Kaelin$Assets$chars$lela_d_1,
        'Kaelin.Assets.chars.octoking_d_1': Kaelin$Assets$chars$octoking_d_1,
        'Web.Kaelin.Entity.background': Web$Kaelin$Entity$background,
        'Kaelin.Assets.dark_grass_4': Kaelin$Assets$dark_grass_4,
        'Web.Kaelin.Coord.new': Web$Kaelin$Coord$new,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'Nat.gtn': Nat$gtn,
        'Int.is_neg': Int$is_neg,
        'Int.new': Int$new,
        'Int.neg': Int$neg,
        'Int.abs': Int$abs,
        'Int.to_nat_signed': Int$to_nat_signed,
        'List.fold': List$fold,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'List.cons': List$cons,
        'Nat.to_base.go': Nat$to_base$go,
        'Nat.to_base': Nat$to_base,
        'String.nil': String$nil,
        'Nat.mod.go': Nat$mod$go,
        'Nat.mod': Nat$mod,
        'Bool.and': Bool$and,
        'Nat.lte': Nat$lte,
        'Maybe': Maybe,
        'List.at': List$at,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Nat.show': Nat$show,
        'Int.show': Int$show,
        'Web.Kaelin.Coord.show': Web$Kaelin$Coord$show,
        'Map.set': Map$set,
        'Maybe.default': Maybe$default,
        'BitsMap.get': BitsMap$get,
        'Map.get': Map$get,
        'Web.Kaelin.Map.push': Web$Kaelin$Map$push,
        'Web.Kaelin.Draw.initial_ent': Web$Kaelin$Draw$initial_ent,
        'Web.Kaelin.State.game': Web$Kaelin$State$game,
        'Web.Kaelin.Resources.room': Web$Kaelin$Resources$room,
        'App.EnvInfo.new': App$EnvInfo$new,
        'DOM.text': DOM$text,
        'VoxBox.clear': VoxBox$clear,
        'Web.Kaelin.Resources.map_size': Web$Kaelin$Resources$map_size,
        'Web.Kaelin.Resources.hexagon_radius': Web$Kaelin$Resources$hexagon_radius,
        'Nat.add': Nat$add,
        'Int.add': Int$add,
        'Int.sub': Int$sub,
        'Word.fold': Word$fold,
        'Nat.mul': Nat$mul,
        'Word.to_nat': Word$to_nat,
        'U32.to_nat': U32$to_nat,
        'Cmp.as_lte': Cmp$as_lte,
        'Word.lte': Word$lte,
        'U32.lte': U32$lte,
        'U32.sub': U32$sub,
        'Web.Kaelin.Coord.fit': Web$Kaelin$Coord$fit,
        'Web.Kaelin.Draw.background': Web$Kaelin$Draw$background,
        'Int.from_u32': Int$from_u32,
        'Pair.fst': Pair$fst,
        'Nat.div': Nat$div,
        'Int.div_nat': Int$div_nat,
        'Web.Kaelin.Resources.center_x': Web$Kaelin$Resources$center_x,
        'Web.Kaelin.Resources.center_y': Web$Kaelin$Resources$center_y,
        'Int.mul': Int$mul,
        'Int.from_nat': Int$from_nat,
        'Int.to_u32': Int$to_u32,
        'Web.Kaelin.Coord.to_screen_xy': Web$Kaelin$Coord$to_screen_xy,
        'VoxBox.Draw.deresagon': VoxBox$Draw$deresagon,
        'Web.Kaelin.Draw.hexagon_border': Web$Kaelin$Draw$hexagon_border,
        'List.for': List$for,
        'List.imap': List$imap,
        'List.indices.u32': List$indices$u32,
        'String.to_list': String$to_list,
        'Bits.to_nat': Bits$to_nat,
        'U16.show_hex': U16$show_hex,
        'PixelFont.get_img': PixelFont$get_img,
        'Word.and': Word$and,
        'U32.and': U32$and,
        'Pos32.get_x': Pos32$get_x,
        'U32.shr': U32$shr,
        'Pos32.get_y': Pos32$get_y,
        'Pos32.get_z': Pos32$get_z,
        'VoxBox.get_len': VoxBox$get_len,
        'Array.get': Array$get,
        'Buffer32.get': Buffer32$get,
        'VoxBox.get_pos': VoxBox$get_pos,
        'VoxBox.get_col': VoxBox$get_col,
        'VoxBox.Draw.image': VoxBox$Draw$image,
        'VoxBox.Draw.text.char': VoxBox$Draw$text$char,
        'Pos32.add': Pos32$add,
        'VoxBox.Draw.text': VoxBox$Draw$text,
        'Map.new': Map$new,
        'PixelFont.set_img': PixelFont$set_img,
        'U16.new': U16$new,
        'Nat.to_u16': Nat$to_u16,
        'PixelFont.small_black.100': PixelFont$small_black$100,
        'PixelFont.small_black.101': PixelFont$small_black$101,
        'PixelFont.small_black.102': PixelFont$small_black$102,
        'PixelFont.small_black.103': PixelFont$small_black$103,
        'PixelFont.small_black.104': PixelFont$small_black$104,
        'PixelFont.small_black.105': PixelFont$small_black$105,
        'PixelFont.small_black.106': PixelFont$small_black$106,
        'PixelFont.small_black.107': PixelFont$small_black$107,
        'PixelFont.small_black.108': PixelFont$small_black$108,
        'PixelFont.small_black.109': PixelFont$small_black$109,
        'PixelFont.small_black.110': PixelFont$small_black$110,
        'PixelFont.small_black.111': PixelFont$small_black$111,
        'PixelFont.small_black.112': PixelFont$small_black$112,
        'PixelFont.small_black.113': PixelFont$small_black$113,
        'PixelFont.small_black.114': PixelFont$small_black$114,
        'PixelFont.small_black.115': PixelFont$small_black$115,
        'PixelFont.small_black.116': PixelFont$small_black$116,
        'PixelFont.small_black.117': PixelFont$small_black$117,
        'PixelFont.small_black.118': PixelFont$small_black$118,
        'PixelFont.small_black.119': PixelFont$small_black$119,
        'PixelFont.small_black.120': PixelFont$small_black$120,
        'PixelFont.small_black.121': PixelFont$small_black$121,
        'PixelFont.small_black.122': PixelFont$small_black$122,
        'PixelFont.small_black.123': PixelFont$small_black$123,
        'PixelFont.small_black.124': PixelFont$small_black$124,
        'PixelFont.small_black.125': PixelFont$small_black$125,
        'PixelFont.small_black.126': PixelFont$small_black$126,
        'PixelFont.small_black.32': PixelFont$small_black$32,
        'PixelFont.small_black.33': PixelFont$small_black$33,
        'PixelFont.small_black.34': PixelFont$small_black$34,
        'PixelFont.small_black.35': PixelFont$small_black$35,
        'PixelFont.small_black.36': PixelFont$small_black$36,
        'PixelFont.small_black.37': PixelFont$small_black$37,
        'PixelFont.small_black.38': PixelFont$small_black$38,
        'PixelFont.small_black.39': PixelFont$small_black$39,
        'PixelFont.small_black.40': PixelFont$small_black$40,
        'PixelFont.small_black.41': PixelFont$small_black$41,
        'PixelFont.small_black.42': PixelFont$small_black$42,
        'PixelFont.small_black.43': PixelFont$small_black$43,
        'PixelFont.small_black.44': PixelFont$small_black$44,
        'PixelFont.small_black.45': PixelFont$small_black$45,
        'PixelFont.small_black.46': PixelFont$small_black$46,
        'PixelFont.small_black.47': PixelFont$small_black$47,
        'PixelFont.small_black.48': PixelFont$small_black$48,
        'PixelFont.small_black.49': PixelFont$small_black$49,
        'PixelFont.small_black.50': PixelFont$small_black$50,
        'PixelFont.small_black.51': PixelFont$small_black$51,
        'PixelFont.small_black.52': PixelFont$small_black$52,
        'PixelFont.small_black.53': PixelFont$small_black$53,
        'PixelFont.small_black.54': PixelFont$small_black$54,
        'PixelFont.small_black.55': PixelFont$small_black$55,
        'PixelFont.small_black.56': PixelFont$small_black$56,
        'PixelFont.small_black.57': PixelFont$small_black$57,
        'PixelFont.small_black.58': PixelFont$small_black$58,
        'PixelFont.small_black.59': PixelFont$small_black$59,
        'PixelFont.small_black.60': PixelFont$small_black$60,
        'PixelFont.small_black.61': PixelFont$small_black$61,
        'PixelFont.small_black.62': PixelFont$small_black$62,
        'PixelFont.small_black.63': PixelFont$small_black$63,
        'PixelFont.small_black.64': PixelFont$small_black$64,
        'PixelFont.small_black.65': PixelFont$small_black$65,
        'PixelFont.small_black.66': PixelFont$small_black$66,
        'PixelFont.small_black.67': PixelFont$small_black$67,
        'PixelFont.small_black.68': PixelFont$small_black$68,
        'PixelFont.small_black.69': PixelFont$small_black$69,
        'PixelFont.small_black.70': PixelFont$small_black$70,
        'PixelFont.small_black.71': PixelFont$small_black$71,
        'PixelFont.small_black.72': PixelFont$small_black$72,
        'PixelFont.small_black.73': PixelFont$small_black$73,
        'PixelFont.small_black.74': PixelFont$small_black$74,
        'PixelFont.small_black.75': PixelFont$small_black$75,
        'PixelFont.small_black.76': PixelFont$small_black$76,
        'PixelFont.small_black.77': PixelFont$small_black$77,
        'PixelFont.small_black.78': PixelFont$small_black$78,
        'PixelFont.small_black.79': PixelFont$small_black$79,
        'PixelFont.small_black.80': PixelFont$small_black$80,
        'PixelFont.small_black.81': PixelFont$small_black$81,
        'PixelFont.small_black.82': PixelFont$small_black$82,
        'PixelFont.small_black.83': PixelFont$small_black$83,
        'PixelFont.small_black.84': PixelFont$small_black$84,
        'PixelFont.small_black.85': PixelFont$small_black$85,
        'PixelFont.small_black.86': PixelFont$small_black$86,
        'PixelFont.small_black.87': PixelFont$small_black$87,
        'PixelFont.small_black.88': PixelFont$small_black$88,
        'PixelFont.small_black.89': PixelFont$small_black$89,
        'PixelFont.small_black.90': PixelFont$small_black$90,
        'PixelFont.small_black.91': PixelFont$small_black$91,
        'PixelFont.small_black.92': PixelFont$small_black$92,
        'PixelFont.small_black.93': PixelFont$small_black$93,
        'PixelFont.small_black.94': PixelFont$small_black$94,
        'PixelFont.small_black.95': PixelFont$small_black$95,
        'PixelFont.small_black.96': PixelFont$small_black$96,
        'PixelFont.small_black.97': PixelFont$small_black$97,
        'PixelFont.small_black.98': PixelFont$small_black$98,
        'PixelFont.small_black.99': PixelFont$small_black$99,
        'PixelFont.small_black': PixelFont$small_black,
        'Web.Kaelin.Draw.tile.empty': Web$Kaelin$Draw$tile$empty,
        'Web.Kaelin.Map.get': Web$Kaelin$Map$get,
        'Web.Kaelin.Draw.tile': Web$Kaelin$Draw$tile,
        'Web.Kaelin.Draw.map': Web$Kaelin$Draw$map,
        'BitsMap.values.go': BitsMap$values$go,
        'Map.values': Map$values,
        'U16.eql': U16$eql,
        'String.eql': String$eql,
        'Web.Kaelin.Draw.state.player': Web$Kaelin$Draw$state$player,
        'Web.Kaelin.Draw.state.players': Web$Kaelin$Draw$state$players,
        'Web.Kaelin.Draw.state': Web$Kaelin$Draw$state,
        'DOM.vbox': DOM$vbox,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Dynamic.new': Dynamic$new,
        'App.pass': App$pass,
        'IO.put_string': IO$put_string,
        'IO.print': IO$print,
        'App.print': App$print,
        'IO.do': IO$do,
        'App.do': App$do,
        'App.watch': App$watch,
        'App.store': App$store,
        'Web.Kaelin.Action.update_interface': Web$Kaelin$Action$update_interface,
        'Pair.show': Pair$show,
        'Word.show': Word$show,
        'U32.show': U32$show,
        'App.post': App$post,
        'Web.Kaelin.Command.create_hero': Web$Kaelin$Command$create_hero,
        'Debug.log': Debug$log,
        'Char.eql': Char$eql,
        'String.starts_with': String$starts_with,
        'Web.Kaelin.Player.new': Web$Kaelin$Player$new,
        'Web.Kaelin.Action.create_player': Web$Kaelin$Action$create_player,
        'App.new': App$new,
        'Web.Kaelin': Web$Kaelin,
    };
})();