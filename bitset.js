/**
 * bitset
 */

const MAXLEN = 52;
var bitset = function(){
    this.bits = 0;
};

module.exports = bitset;

bitset.prototype.set = function(pos, b){
    if(pos>=0 && pos<MAXLEN) {
        if(b) {
            this.bits |= 1<<pos;
        }
        else{
            this.bits &= ~(1<<pos);
        }
    }
};

bitset.prototype.test = function(pos) {
    return (this.bits & (1<<pos)) > 0;
};

bitset.prototype.val = function(){
    return this.bits;
};


bitset.prototype.setx = function(bits, pos, b) {
    if(pos>=0 && pos < MAXLEN) {
        if(b) {
            bits |= 1<<pos;
        }
        else{
            bits &= ~(1<<pos);
        }
    }
    return bits;
}

bitset.prototype.testx = function(bits, pos) {
    return (bits & (1<<pos)) > 0;
};