"use strict";var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};
sjcl.cipher.aes=function(a){this.s[0][0][0]||this.O();var b,c,d,e,f=this.s[0][4],g=this.s[1];b=a.length;var h=1;if(4!==b&&6!==b&&8!==b)throw new sjcl.exception.invalid("invalid aes key size");this.b=[d=a.slice(0),e=[]];for(a=b;a<4*b+28;a++){c=d[a-1];if(0===a%b||8===b&&4===a%b)c=f[c>>>24]<<24^f[c>>16&255]<<16^f[c>>8&255]<<8^f[c&255],0===a%b&&(c=c<<8^c>>>24^h<<24,h=h<<1^283*(h>>7));d[a]=d[a-b]^c}for(b=0;a;b++,a--)c=d[b&3?a:a-4],e[b]=4>=a||4>b?c:g[0][f[c>>>24]]^g[1][f[c>>16&255]]^g[2][f[c>>8&255]]^g[3][f[c&
255]]};
sjcl.cipher.aes.prototype={encrypt:function(a){return t(this,a,0)},decrypt:function(a){return t(this,a,1)},s:[[[],[],[],[],[]],[[],[],[],[],[]]],O:function(){var a=this.s[0],b=this.s[1],c=a[4],d=b[4],e,f,g,h=[],k=[],l,n,m,p;for(e=0;0x100>e;e++)k[(h[e]=e<<1^283*(e>>7))^e]=e;for(f=g=0;!c[f];f^=l||1,g=k[g]||1)for(m=g^g<<1^g<<2^g<<3^g<<4,m=m>>8^m&255^99,c[f]=m,d[m]=f,n=h[e=h[l=h[f]]],p=0x1010101*n^0x10001*e^0x101*l^0x1010100*f,n=0x101*h[m]^0x1010100*m,e=0;4>e;e++)a[e][f]=n=n<<24^n>>>8,b[e][m]=p=p<<24^p>>>8;for(e=
0;5>e;e++)a[e]=a[e].slice(0),b[e]=b[e].slice(0)}};
function t(a,b,c){if(4!==b.length)throw new sjcl.exception.invalid("invalid aes block size");var d=a.b[c],e=b[0]^d[0],f=b[c?3:1]^d[1],g=b[2]^d[2];b=b[c?1:3]^d[3];var h,k,l,n=d.length/4-2,m,p=4,r=[0,0,0,0];h=a.s[c];a=h[0];var q=h[1],v=h[2],w=h[3],x=h[4];for(m=0;m<n;m++)h=a[e>>>24]^q[f>>16&255]^v[g>>8&255]^w[b&255]^d[p],k=a[f>>>24]^q[g>>16&255]^v[b>>8&255]^w[e&255]^d[p+1],l=a[g>>>24]^q[b>>16&255]^v[e>>8&255]^w[f&255]^d[p+2],b=a[b>>>24]^q[e>>16&255]^v[f>>8&255]^w[g&255]^d[p+3],p+=4,e=h,f=k,g=l;for(m=
0;4>m;m++)r[c?3&-m:m]=x[e>>>24]<<24^x[f>>16&255]<<16^x[g>>8&255]<<8^x[b&255]^d[p++],h=e,e=f,f=g,g=b,b=h;return r}
sjcl.bitArray={bitSlice:function(a,b,c){a=sjcl.bitArray.$(a.slice(b/32),32-(b&31)).slice(1);return void 0===c?a:sjcl.bitArray.clamp(a,c-b)},extract:function(a,b,c){var d=Math.floor(-b-c&31);return((b+c-1^b)&-32?a[b/32|0]<<32-d^a[b/32+1|0]>>>d:a[b/32|0]>>>d)&(1<<c)-1},concat:function(a,b){if(0===a.length||0===b.length)return a.concat(b);var c=a[a.length-1],d=sjcl.bitArray.getPartial(c);return 32===d?a.concat(b):sjcl.bitArray.$(b,d,c|0,a.slice(0,a.length-1))},bitLength:function(a){var b=a.length;return 0===
b?0:32*(b-1)+sjcl.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(32*a.length<b)return a;a=a.slice(0,Math.ceil(b/32));var c=a.length;b=b&31;0<c&&b&&(a[c-1]=sjcl.bitArray.partial(b,a[c-1]&2147483648>>b-1,1));return a},partial:function(a,b,c){return 32===a?b:(c?b|0:b<<32-a)+0x10000000000*a},getPartial:function(a){return Math.round(a/0x10000000000)||32},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b))return!1;var c=0,d;for(d=0;d<a.length;d++)c|=a[d]^b[d];return 0===
c},$:function(a,b,c,d){var e;e=0;for(void 0===d&&(d=[]);32<=b;b-=32)d.push(c),c=0;if(0===b)return d.concat(a);for(e=0;e<a.length;e++)d.push(c|a[e]>>>b),c=a[e]<<32-b;e=a.length?a[a.length-1]:0;a=sjcl.bitArray.getPartial(e);d.push(sjcl.bitArray.partial(b+a&31,32<b+a?c:d.pop(),1));return d},i:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]},byteswapM:function(a){var b,c;for(b=0;b<a.length;++b)c=a[b],a[b]=c>>>24|c>>>8&0xff00|(c&0xff00)<<8|c<<24;return a}};
sjcl.codec.utf8String={fromBits:function(a){var b="",c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++)0===(d&3)&&(e=a[d/4]),b+=String.fromCharCode(e>>>8>>>8>>>8),e<<=8;return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],c,d=0;for(c=0;c<a.length;c++)d=d<<8|a.charCodeAt(c),3===(c&3)&&(b.push(d),d=0);c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};
sjcl.codec.hex={fromBits:function(a){var b="",c;for(c=0;c<a.length;c++)b+=((a[c]|0)+0xf00000000000).toString(16).substr(4);return b.substr(0,sjcl.bitArray.bitLength(a)/4)},toBits:function(a){var b,c=[],d;a=a.replace(/\s|0x/g,"");d=a.length;a=a+"00000000";for(b=0;b<a.length;b+=8)c.push(parseInt(a.substr(b,8),16)^0);return sjcl.bitArray.clamp(c,4*d)}};
sjcl.codec.base32={B:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",X:"0123456789ABCDEFGHIJKLMNOPQRSTUV",BITS:32,BASE:5,REMAINING:27,fromBits:function(a,b,c){var d=sjcl.codec.base32.BASE,e=sjcl.codec.base32.REMAINING,f="",g=0,h=sjcl.codec.base32.B,k=0,l=sjcl.bitArray.bitLength(a);c&&(h=sjcl.codec.base32.X);for(c=0;f.length*d<l;)f+=h.charAt((k^a[c]>>>g)>>>e),g<d?(k=a[c]<<d-g,g+=e,c++):(k<<=d,g-=d);for(;f.length&7&&!b;)f+="=";return f},toBits:function(a,b){a=a.replace(/\s|=/g,"").toUpperCase();var c=sjcl.codec.base32.BITS,
d=sjcl.codec.base32.BASE,e=sjcl.codec.base32.REMAINING,f=[],g,h=0,k=sjcl.codec.base32.B,l=0,n,m="base32";b&&(k=sjcl.codec.base32.X,m="base32hex");for(g=0;g<a.length;g++){n=k.indexOf(a.charAt(g));if(0>n){if(!b)try{return sjcl.codec.base32hex.toBits(a)}catch(p){}throw new sjcl.exception.invalid("this isn't "+m+"!");}h>e?(h-=e,f.push(l^n>>>h),l=n<<c-h):(h+=d,l^=n<<c-h)}h&56&&f.push(sjcl.bitArray.partial(h&56,l,1));return f}};
sjcl.codec.base32hex={fromBits:function(a,b){return sjcl.codec.base32.fromBits(a,b,1)},toBits:function(a){return sjcl.codec.base32.toBits(a,1)}};
sjcl.codec.base64={B:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fromBits:function(a,b,c){var d="",e=0,f=sjcl.codec.base64.B,g=0,h=sjcl.bitArray.bitLength(a);c&&(f=f.substr(0,62)+"-_");for(c=0;6*d.length<h;)d+=f.charAt((g^a[c]>>>e)>>>26),6>e?(g=a[c]<<6-e,e+=26,c++):(g<<=6,e-=6);for(;d.length&3&&!b;)d+="=";return d},toBits:function(a,b){a=a.replace(/\s|=/g,"");var c=[],d,e=0,f=sjcl.codec.base64.B,g=0,h;b&&(f=f.substr(0,62)+"-_");for(d=0;d<a.length;d++){h=f.indexOf(a.charAt(d));
if(0>h)throw new sjcl.exception.invalid("this isn't base64!");26<e?(e-=26,c.push(g^h>>>e),g=h<<32-e):(e+=6,g^=h<<32-e)}e&56&&c.push(sjcl.bitArray.partial(e&56,g,1));return c}};sjcl.codec.base64url={fromBits:function(a){return sjcl.codec.base64.fromBits(a,1,1)},toBits:function(a){return sjcl.codec.base64.toBits(a,1)}};sjcl.hash.sha256=function(a){this.b[0]||this.O();a?(this.F=a.F.slice(0),this.A=a.A.slice(0),this.l=a.l):this.reset()};sjcl.hash.sha256.hash=function(a){return(new sjcl.hash.sha256).update(a).finalize()};
sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this.F=this.Y.slice(0);this.A=[];this.l=0;return this},update:function(a){"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));var b,c=this.A=sjcl.bitArray.concat(this.A,a);b=this.l;a=this.l=b+sjcl.bitArray.bitLength(a);if(0x1fffffffffffff<a)throw new sjcl.exception.invalid("Cannot hash more than 2^53 - 1 bits");if("undefined"!==typeof Uint32Array){var d=new Uint32Array(c),e=0;for(b=512+b-(512+b&0x1ff);b<=a;b+=512)u(this,d.subarray(16*e,
16*(e+1))),e+=1;c.splice(0,16*e)}else for(b=512+b-(512+b&0x1ff);b<=a;b+=512)u(this,c.splice(0,16));return this},finalize:function(){var a,b=this.A,c=this.F,b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this.l/0x100000000));for(b.push(this.l|0);b.length;)u(this,b.splice(0,16));this.reset();return c},Y:[],b:[],O:function(){function a(a){return 0x100000000*(a-Math.floor(a))|0}for(var b=0,c=2,d,e;64>b;c++){e=!0;for(d=2;d*d<=c;d++)if(0===c%d){e=
!1;break}e&&(8>b&&(this.Y[b]=a(Math.pow(c,.5))),this.b[b]=a(Math.pow(c,1/3)),b++)}}};
function u(a,b){var c,d,e,f=a.F,g=a.b,h=f[0],k=f[1],l=f[2],n=f[3],m=f[4],p=f[5],r=f[6],q=f[7];for(c=0;64>c;c++)16>c?d=b[c]:(d=b[c+1&15],e=b[c+14&15],d=b[c&15]=(d>>>7^d>>>18^d>>>3^d<<25^d<<14)+(e>>>17^e>>>19^e>>>10^e<<15^e<<13)+b[c&15]+b[c+9&15]|0),d=d+q+(m>>>6^m>>>11^m>>>25^m<<26^m<<21^m<<7)+(r^m&(p^r))+g[c],q=r,r=p,p=m,m=n+d|0,n=l,l=k,k=h,h=d+(k&l^n&(k^l))+(k>>>2^k>>>13^k>>>22^k<<30^k<<19^k<<10)|0;f[0]=f[0]+h|0;f[1]=f[1]+k|0;f[2]=f[2]+l|0;f[3]=f[3]+n|0;f[4]=f[4]+m|0;f[5]=f[5]+p|0;f[6]=f[6]+r|0;f[7]=
f[7]+q|0}
sjcl.mode.ccm={name:"ccm",G:[],listenProgress:function(a){sjcl.mode.ccm.G.push(a)},unListenProgress:function(a){a=sjcl.mode.ccm.G.indexOf(a);-1<a&&sjcl.mode.ccm.G.splice(a,1)},fa:function(a){var b=sjcl.mode.ccm.G.slice(),c;for(c=0;c<b.length;c+=1)b[c](a)},encrypt:function(a,b,c,d,e){var f,g=b.slice(0),h=sjcl.bitArray,k=h.bitLength(c)/8,l=h.bitLength(g)/8;e=e||64;d=d||[];if(7>k)throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");for(f=2;4>f&&l>>>8*f;f++);f<15-k&&(f=15-k);c=h.clamp(c,
8*(15-f));b=sjcl.mode.ccm.V(a,b,c,d,e,f);g=sjcl.mode.ccm.C(a,g,c,b,e,f);return h.concat(g.data,g.tag)},decrypt:function(a,b,c,d,e){e=e||64;d=d||[];var f=sjcl.bitArray,g=f.bitLength(c)/8,h=f.bitLength(b),k=f.clamp(b,h-e),l=f.bitSlice(b,h-e),h=(h-e)/8;if(7>g)throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");for(b=2;4>b&&h>>>8*b;b++);b<15-g&&(b=15-g);c=f.clamp(c,8*(15-b));k=sjcl.mode.ccm.C(a,k,c,l,e,b);a=sjcl.mode.ccm.V(a,k.data,c,d,e,b);if(!f.equal(k.tag,a))throw new sjcl.exception.corrupt("ccm: tag doesn't match");
return k.data},na:function(a,b,c,d,e,f){var g=[],h=sjcl.bitArray,k=h.i;d=[h.partial(8,(b.length?64:0)|d-2<<2|f-1)];d=h.concat(d,c);d[3]|=e;d=a.encrypt(d);if(b.length)for(c=h.bitLength(b)/8,65279>=c?g=[h.partial(16,c)]:0xffffffff>=c&&(g=h.concat([h.partial(16,65534)],[c])),g=h.concat(g,b),b=0;b<g.length;b+=4)d=a.encrypt(k(d,g.slice(b,b+4).concat([0,0,0])));return d},V:function(a,b,c,d,e,f){var g=sjcl.bitArray,h=g.i;e/=8;if(e%2||4>e||16<e)throw new sjcl.exception.invalid("ccm: invalid tag length");
if(0xffffffff<d.length||0xffffffff<b.length)throw new sjcl.exception.bug("ccm: can't deal with 4GiB or more data");c=sjcl.mode.ccm.na(a,d,c,e,g.bitLength(b)/8,f);for(d=0;d<b.length;d+=4)c=a.encrypt(h(c,b.slice(d,d+4).concat([0,0,0])));return g.clamp(c,8*e)},C:function(a,b,c,d,e,f){var g,h=sjcl.bitArray;g=h.i;var k=b.length,l=h.bitLength(b),n=k/50,m=n;c=h.concat([h.partial(8,f-1)],c).concat([0,0,0]).slice(0,4);d=h.bitSlice(g(d,a.encrypt(c)),0,e);if(!k)return{tag:d,data:[]};for(g=0;g<k;g+=4)g>n&&(sjcl.mode.ccm.fa(g/
k),n+=m),c[3]++,e=a.encrypt(c),b[g]^=e[0],b[g+1]^=e[1],b[g+2]^=e[2],b[g+3]^=e[3];return{tag:d,data:h.clamp(b,l)}}};
sjcl.mode.ocb2={name:"ocb2",encrypt:function(a,b,c,d,e,f){if(128!==sjcl.bitArray.bitLength(c))throw new sjcl.exception.invalid("ocb iv must be 128 bits");var g,h=sjcl.mode.ocb2.S,k=sjcl.bitArray,l=k.i,n=[0,0,0,0];c=h(a.encrypt(c));var m,p=[];d=d||[];e=e||64;for(g=0;g+4<b.length;g+=4)m=b.slice(g,g+4),n=l(n,m),p=p.concat(l(c,a.encrypt(l(c,m)))),c=h(c);m=b.slice(g);b=k.bitLength(m);g=a.encrypt(l(c,[0,0,0,b]));m=k.clamp(l(m.concat([0,0,0]),g),b);n=l(n,l(m.concat([0,0,0]),g));n=a.encrypt(l(n,l(c,h(c))));
d.length&&(n=l(n,f?d:sjcl.mode.ocb2.pmac(a,d)));return p.concat(k.concat(m,k.clamp(n,e)))},decrypt:function(a,b,c,d,e,f){if(128!==sjcl.bitArray.bitLength(c))throw new sjcl.exception.invalid("ocb iv must be 128 bits");e=e||64;var g=sjcl.mode.ocb2.S,h=sjcl.bitArray,k=h.i,l=[0,0,0,0],n=g(a.encrypt(c)),m,p,r=sjcl.bitArray.bitLength(b)-e,q=[];d=d||[];for(c=0;c+4<r/32;c+=4)m=k(n,a.decrypt(k(n,b.slice(c,c+4)))),l=k(l,m),q=q.concat(m),n=g(n);p=r-32*c;m=a.encrypt(k(n,[0,0,0,p]));m=k(m,h.clamp(b.slice(c),p).concat([0,
0,0]));l=k(l,m);l=a.encrypt(k(l,k(n,g(n))));d.length&&(l=k(l,f?d:sjcl.mode.ocb2.pmac(a,d)));if(!h.equal(h.clamp(l,e),h.bitSlice(b,r)))throw new sjcl.exception.corrupt("ocb: tag doesn't match");return q.concat(h.clamp(m,p))},pmac:function(a,b){var c,d=sjcl.mode.ocb2.S,e=sjcl.bitArray,f=e.i,g=[0,0,0,0],h=a.encrypt([0,0,0,0]),h=f(h,d(d(h)));for(c=0;c+4<b.length;c+=4)h=d(h),g=f(g,a.encrypt(f(h,b.slice(c,c+4))));c=b.slice(c);128>e.bitLength(c)&&(h=f(h,d(h)),c=e.concat(c,[-2147483648,0,0,0]));g=f(g,c);
return a.encrypt(f(d(f(h,d(h))),g))},S:function(a){return[a[0]<<1^a[1]>>>31,a[1]<<1^a[2]>>>31,a[2]<<1^a[3]>>>31,a[3]<<1^135*(a[0]>>>31)]}};
sjcl.mode.gcm={name:"gcm",encrypt:function(a,b,c,d,e){var f=b.slice(0);b=sjcl.bitArray;d=d||[];a=sjcl.mode.gcm.C(!0,a,f,d,c,e||128);return b.concat(a.data,a.tag)},decrypt:function(a,b,c,d,e){var f=b.slice(0),g=sjcl.bitArray,h=g.bitLength(f);e=e||128;d=d||[];e<=h?(b=g.bitSlice(f,h-e),f=g.bitSlice(f,0,h-e)):(b=f,f=[]);a=sjcl.mode.gcm.C(!1,a,f,d,c,e);if(!g.equal(a.tag,b))throw new sjcl.exception.corrupt("gcm: tag doesn't match");return a.data},ka:function(a,b){var c,d,e,f,g,h=sjcl.bitArray.i;e=[0,0,
0,0];f=b.slice(0);for(c=0;128>c;c++){(d=0!==(a[Math.floor(c/32)]&1<<31-c%32))&&(e=h(e,f));g=0!==(f[3]&1);for(d=3;0<d;d--)f[d]=f[d]>>>1|(f[d-1]&1)<<31;f[0]>>>=1;g&&(f[0]^=-0x1f000000)}return e},j:function(a,b,c){var d,e=c.length;b=b.slice(0);for(d=0;d<e;d+=4)b[0]^=0xffffffff&c[d],b[1]^=0xffffffff&c[d+1],b[2]^=0xffffffff&c[d+2],b[3]^=0xffffffff&c[d+3],b=sjcl.mode.gcm.ka(b,a);return b},C:function(a,b,c,d,e,f){var g,h,k,l,n,m,p,r,q=sjcl.bitArray;m=c.length;p=q.bitLength(c);r=q.bitLength(d);h=q.bitLength(e);
g=b.encrypt([0,0,0,0]);96===h?(e=e.slice(0),e=q.concat(e,[1])):(e=sjcl.mode.gcm.j(g,[0,0,0,0],e),e=sjcl.mode.gcm.j(g,e,[0,0,Math.floor(h/0x100000000),h&0xffffffff]));h=sjcl.mode.gcm.j(g,[0,0,0,0],d);n=e.slice(0);d=h.slice(0);a||(d=sjcl.mode.gcm.j(g,h,c));for(l=0;l<m;l+=4)n[3]++,k=b.encrypt(n),c[l]^=k[0],c[l+1]^=k[1],c[l+2]^=k[2],c[l+3]^=k[3];c=q.clamp(c,p);a&&(d=sjcl.mode.gcm.j(g,h,c));a=[Math.floor(r/0x100000000),r&0xffffffff,Math.floor(p/0x100000000),p&0xffffffff];d=sjcl.mode.gcm.j(g,d,a);k=b.encrypt(e);
d[0]^=k[0];d[1]^=k[1];d[2]^=k[2];d[3]^=k[3];return{tag:q.bitSlice(d,0,f),data:c}}};sjcl.misc.hmac=function(a,b){this.W=b=b||sjcl.hash.sha256;var c=[[],[]],d,e=b.prototype.blockSize/32;this.w=[new b,new b];a.length>e&&(a=b.hash(a));for(d=0;d<e;d++)c[0][d]=a[d]^909522486,c[1][d]=a[d]^1549556828;this.w[0].update(c[0]);this.w[1].update(c[1]);this.R=new b(this.w[0])};
sjcl.misc.hmac.prototype.encrypt=sjcl.misc.hmac.prototype.mac=function(a){if(this.aa)throw new sjcl.exception.invalid("encrypt on already updated hmac called!");this.update(a);return this.digest(a)};sjcl.misc.hmac.prototype.reset=function(){this.R=new this.W(this.w[0]);this.aa=!1};sjcl.misc.hmac.prototype.update=function(a){this.aa=!0;this.R.update(a)};sjcl.misc.hmac.prototype.digest=function(){var a=this.R.finalize(),a=(new this.W(this.w[1])).update(a).finalize();this.reset();return a};
sjcl.misc.pbkdf2=function(a,b,c,d,e){c=c||1E4;if(0>d||0>c)throw new sjcl.exception.invalid("invalid params to pbkdf2");"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));e=e||sjcl.misc.hmac;a=new e(a);var f,g,h,k,l=[],n=sjcl.bitArray;for(k=1;32*l.length<(d||1);k++){e=f=a.encrypt(n.concat(b,[k]));for(g=1;g<c;g++)for(f=a.encrypt(f),h=0;h<f.length;h++)e[h]^=f[h];l=l.concat(e)}d&&(l=n.clamp(l,d));return l};
sjcl.prng=function(a){this.c=[new sjcl.hash.sha256];this.m=[0];this.P=0;this.H={};this.N=0;this.U={};this.Z=this.f=this.o=this.ha=0;this.b=[0,0,0,0,0,0,0,0];this.h=[0,0,0,0];this.L=void 0;this.M=a;this.D=!1;this.K={progress:{},seeded:{}};this.u=this.ga=0;this.I=1;this.J=2;this.ca=0x10000;this.T=[0,48,64,96,128,192,0x100,384,512,768,1024];this.da=3E4;this.ba=80};
sjcl.prng.prototype={randomWords:function(a,b){var c=[],d;d=this.isReady(b);var e;if(d===this.u)throw new sjcl.exception.notReady("generator isn't seeded");if(d&this.J){d=!(d&this.I);e=[];var f=0,g;this.Z=e[0]=(new Date).valueOf()+this.da;for(g=0;16>g;g++)e.push(0x100000000*Math.random()|0);for(g=0;g<this.c.length&&(e=e.concat(this.c[g].finalize()),f+=this.m[g],this.m[g]=0,d||!(this.P&1<<g));g++);this.P>=1<<this.c.length&&(this.c.push(new sjcl.hash.sha256),this.m.push(0));this.f-=f;f>this.o&&(this.o=
f);this.P++;this.b=sjcl.hash.sha256.hash(this.b.concat(e));this.L=new sjcl.cipher.aes(this.b);for(d=0;4>d&&(this.h[d]=this.h[d]+1|0,!this.h[d]);d++);}for(d=0;d<a;d+=4)0===(d+1)%this.ca&&y(this),e=z(this),c.push(e[0],e[1],e[2],e[3]);y(this);return c.slice(0,a)},setDefaultParanoia:function(a,b){if(0===a&&"Setting paranoia=0 will ruin your security; use it only for testing"!==b)throw new sjcl.exception.invalid("Setting paranoia=0 will ruin your security; use it only for testing");this.M=a},addEntropy:function(a,
b,c){c=c||"user";var d,e,f=(new Date).valueOf(),g=this.H[c],h=this.isReady(),k=0;d=this.U[c];void 0===d&&(d=this.U[c]=this.ha++);void 0===g&&(g=this.H[c]=0);this.H[c]=(this.H[c]+1)%this.c.length;switch(typeof a){case "number":void 0===b&&(b=1);this.c[g].update([d,this.N++,1,b,f,1,a|0]);break;case "object":c=Object.prototype.toString.call(a);if("[object Uint32Array]"===c){e=[];for(c=0;c<a.length;c++)e.push(a[c]);a=e}else for("[object Array]"!==c&&(k=1),c=0;c<a.length&&!k;c++)"number"!==typeof a[c]&&
(k=1);if(!k){if(void 0===b)for(c=b=0;c<a.length;c++)for(e=a[c];0<e;)b++,e=e>>>1;this.c[g].update([d,this.N++,2,b,f,a.length].concat(a))}break;case "string":void 0===b&&(b=a.length);this.c[g].update([d,this.N++,3,b,f,a.length]);this.c[g].update(a);break;default:k=1}if(k)throw new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string");this.m[g]+=b;this.f+=b;h===this.u&&(this.isReady()!==this.u&&A("seeded",Math.max(this.o,this.f)),A("progress",this.getProgress()))},
isReady:function(a){a=this.T[void 0!==a?a:this.M];return this.o&&this.o>=a?this.m[0]>this.ba&&(new Date).valueOf()>this.Z?this.J|this.I:this.I:this.f>=a?this.J|this.u:this.u},getProgress:function(a){a=this.T[a?a:this.M];return this.o>=a?1:this.f>a?1:this.f/a},startCollectors:function(){if(!this.D){this.a={loadTimeCollector:B(this,this.ma),mouseCollector:B(this,this.oa),keyboardCollector:B(this,this.la),accelerometerCollector:B(this,this.ea),touchCollector:B(this,this.qa)};if(window.addEventListener)window.addEventListener("load",
this.a.loadTimeCollector,!1),window.addEventListener("mousemove",this.a.mouseCollector,!1),window.addEventListener("keypress",this.a.keyboardCollector,!1),window.addEventListener("devicemotion",this.a.accelerometerCollector,!1),window.addEventListener("touchmove",this.a.touchCollector,!1);else if(document.attachEvent)document.attachEvent("onload",this.a.loadTimeCollector),document.attachEvent("onmousemove",this.a.mouseCollector),document.attachEvent("keypress",this.a.keyboardCollector);else throw new sjcl.exception.bug("can't attach event");
this.D=!0}},stopCollectors:function(){this.D&&(window.removeEventListener?(window.removeEventListener("load",this.a.loadTimeCollector,!1),window.removeEventListener("mousemove",this.a.mouseCollector,!1),window.removeEventListener("keypress",this.a.keyboardCollector,!1),window.removeEventListener("devicemotion",this.a.accelerometerCollector,!1),window.removeEventListener("touchmove",this.a.touchCollector,!1)):document.detachEvent&&(document.detachEvent("onload",this.a.loadTimeCollector),document.detachEvent("onmousemove",
this.a.mouseCollector),document.detachEvent("keypress",this.a.keyboardCollector)),this.D=!1)},addEventListener:function(a,b){this.K[a][this.ga++]=b},removeEventListener:function(a,b){var c,d,e=this.K[a],f=[];for(d in e)e.hasOwnProperty(d)&&e[d]===b&&f.push(d);for(c=0;c<f.length;c++)d=f[c],delete e[d]},la:function(){C(this,1)},oa:function(a){var b,c;try{b=a.x||a.clientX||a.offsetX||0,c=a.y||a.clientY||a.offsetY||0}catch(d){c=b=0}0!=b&&0!=c&&this.addEntropy([b,c],2,"mouse");C(this,0)},qa:function(a){a=
a.touches[0]||a.changedTouches[0];this.addEntropy([a.pageX||a.clientX,a.pageY||a.clientY],1,"touch");C(this,0)},ma:function(){C(this,2)},ea:function(a){a=a.accelerationIncludingGravity.x||a.accelerationIncludingGravity.y||a.accelerationIncludingGravity.z;if(window.orientation){var b=window.orientation;"number"===typeof b&&this.addEntropy(b,1,"accelerometer")}a&&this.addEntropy(a,2,"accelerometer");C(this,0)}};
function A(a,b){var c,d=sjcl.random.K[a],e=[];for(c in d)d.hasOwnProperty(c)&&e.push(d[c]);for(c=0;c<e.length;c++)e[c](b)}function C(a,b){"undefined"!==typeof window&&window.performance&&"function"===typeof window.performance.now?a.addEntropy(window.performance.now(),b,"loadtime"):a.addEntropy((new Date).valueOf(),b,"loadtime")}function y(a){a.b=z(a).concat(z(a));a.L=new sjcl.cipher.aes(a.b)}function z(a){for(var b=0;4>b&&(a.h[b]=a.h[b]+1|0,!a.h[b]);b++);return a.L.encrypt(a.h)}
function B(a,b){return function(){b.apply(a,arguments)}}sjcl.random=new sjcl.prng(6);
a:try{var D,E,F,G;if(G="undefined"!==typeof module&&module.exports){var H;try{H=require("crypto")}catch(a){H=null}G=E=H}if(G&&E.randomBytes)D=E.randomBytes(128),D=new Uint32Array((new Uint8Array(D)).buffer),sjcl.random.addEntropy(D,1024,"crypto['randomBytes']");else if("undefined"!==typeof window&&"undefined"!==typeof Uint32Array){F=new Uint32Array(32);if(window.crypto&&window.crypto.getRandomValues)window.crypto.getRandomValues(F);else if(window.msCrypto&&window.msCrypto.getRandomValues)window.msCrypto.getRandomValues(F);
else break a;sjcl.random.addEntropy(F,1024,"crypto['getRandomValues']")}}catch(a){"undefined"!==typeof window&&window.console&&(console.log("There was an error collecting entropy from the browser:"),console.log(a))}
sjcl.json={defaults:{v:1,iter:1E4,ks:128,ts:64,mode:"ccm",adata:"",cipher:"aes"},ja:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json,f=e.g({iv:sjcl.random.randomWords(4,0)},e.defaults),g;e.g(f,c);c=f.adata;"string"===typeof f.salt&&(f.salt=sjcl.codec.base64.toBits(f.salt));"string"===typeof f.iv&&(f.iv=sjcl.codec.base64.toBits(f.iv));if(!sjcl.mode[f.mode]||!sjcl.cipher[f.cipher]||"string"===typeof a&&100>=f.iter||64!==f.ts&&96!==f.ts&&128!==f.ts||128!==f.ks&&192!==f.ks&&0x100!==f.ks||2>f.iv.length||
4<f.iv.length)throw new sjcl.exception.invalid("json encrypt: invalid parameters");"string"===typeof a?(g=sjcl.misc.cachedPbkdf2(a,f),a=g.key.slice(0,f.ks/32),f.salt=g.salt):sjcl.ecc&&a instanceof sjcl.ecc.elGamal.publicKey&&(g=a.kem(),f.kemtag=g.tag,a=g.key.slice(0,f.ks/32));"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));"string"===typeof c&&(f.adata=c=sjcl.codec.utf8String.toBits(c));g=new sjcl.cipher[f.cipher](a);e.g(d,f);d.key=a;f.ct="ccm"===f.mode&&sjcl.arrayBuffer&&sjcl.arrayBuffer.ccm&&
b instanceof ArrayBuffer?sjcl.arrayBuffer.ccm.encrypt(g,b,f.iv,c,f.ts):sjcl.mode[f.mode].encrypt(g,b,f.iv,c,f.ts);return f},encrypt:function(a,b,c,d){var e=sjcl.json,f=e.ja.apply(e,arguments);return e.encode(f)},ia:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json;b=e.g(e.g(e.g({},e.defaults),b),c,!0);var f,g;f=b.adata;"string"===typeof b.salt&&(b.salt=sjcl.codec.base64.toBits(b.salt));"string"===typeof b.iv&&(b.iv=sjcl.codec.base64.toBits(b.iv));if(!sjcl.mode[b.mode]||!sjcl.cipher[b.cipher]||"string"===
typeof a&&100>=b.iter||64!==b.ts&&96!==b.ts&&128!==b.ts||128!==b.ks&&192!==b.ks&&0x100!==b.ks||!b.iv||2>b.iv.length||4<b.iv.length)throw new sjcl.exception.invalid("json decrypt: invalid parameters");"string"===typeof a?(g=sjcl.misc.cachedPbkdf2(a,b),a=g.key.slice(0,b.ks/32),b.salt=g.salt):sjcl.ecc&&a instanceof sjcl.ecc.elGamal.secretKey&&(a=a.unkem(sjcl.codec.base64.toBits(b.kemtag)).slice(0,b.ks/32));"string"===typeof f&&(f=sjcl.codec.utf8String.toBits(f));g=new sjcl.cipher[b.cipher](a);f="ccm"===
b.mode&&sjcl.arrayBuffer&&sjcl.arrayBuffer.ccm&&b.ct instanceof ArrayBuffer?sjcl.arrayBuffer.ccm.decrypt(g,b.ct,b.iv,b.tag,f,b.ts):sjcl.mode[b.mode].decrypt(g,b.ct,b.iv,f,b.ts);e.g(d,b);d.key=a;return 1===c.raw?f:sjcl.codec.utf8String.fromBits(f)},decrypt:function(a,b,c,d){var e=sjcl.json;return e.ia(a,e.decode(b),c,d)},encode:function(a){var b,c="{",d="";for(b in a)if(a.hasOwnProperty(b)){if(!b.match(/^[a-z0-9]+$/i))throw new sjcl.exception.invalid("json encode: invalid property name");c+=d+'"'+
b+'":';d=",";switch(typeof a[b]){case "number":case "boolean":c+=a[b];break;case "string":c+='"'+escape(a[b])+'"';break;case "object":c+='"'+sjcl.codec.base64.fromBits(a[b],0)+'"';break;default:throw new sjcl.exception.bug("json encode: unsupported type");}}return c+"}"},decode:function(a){a=a.replace(/\s/g,"");if(!a.match(/^\{.*\}$/))throw new sjcl.exception.invalid("json decode: this isn't json!");a=a.replace(/^\{|\}$/g,"").split(/,/);var b={},c,d;for(c=0;c<a.length;c++){if(!(d=a[c].match(/^\s*(?:(["']?)([a-z][a-z0-9]*)\1)\s*:\s*(?:(-?\d+)|"([a-z0-9+\/%*_.@=\-]*)"|(true|false))$/i)))throw new sjcl.exception.invalid("json decode: this isn't json!");
null!=d[3]?b[d[2]]=parseInt(d[3],10):null!=d[4]?b[d[2]]=d[2].match(/^(ct|adata|salt|iv)$/)?sjcl.codec.base64.toBits(d[4]):unescape(d[4]):null!=d[5]&&(b[d[2]]="true"===d[5])}return b},g:function(a,b,c){void 0===a&&(a={});if(void 0===b)return a;for(var d in b)if(b.hasOwnProperty(d)){if(c&&void 0!==a[d]&&a[d]!==b[d])throw new sjcl.exception.invalid("required parameter overridden");a[d]=b[d]}return a},sa:function(a,b){var c={},d;for(d in a)a.hasOwnProperty(d)&&a[d]!==b[d]&&(c[d]=a[d]);return c},ra:function(a,
b){var c={},d;for(d=0;d<b.length;d++)void 0!==a[b[d]]&&(c[b[d]]=a[b[d]]);return c}};sjcl.encrypt=sjcl.json.encrypt;sjcl.decrypt=sjcl.json.decrypt;sjcl.misc.pa={};sjcl.misc.cachedPbkdf2=function(a,b){var c=sjcl.misc.pa,d;b=b||{};d=b.iter||1E3;c=c[a]=c[a]||{};d=c[d]=c[d]||{firstSalt:b.salt&&b.salt.length?b.salt.slice(0):sjcl.random.randomWords(2,0)};c=void 0===b.salt?d.firstSalt:b.salt;d[c]=d[c]||sjcl.misc.pbkdf2(a,c,b.iter);return{key:d[c].slice(0),salt:c.slice(0)}};
"undefined"!==typeof module&&module.exports&&(module.exports=sjcl);"function"===typeof define&&define([],function(){return sjcl});







/////////////////


!function(t,e){!function t(e,n,a,i){var o=!!(e.Worker&&e.Blob&&e.Promise&&e.OffscreenCanvas&&e.OffscreenCanvasRenderingContext2D&&e.HTMLCanvasElement&&e.HTMLCanvasElement.prototype.transferControlToOffscreen&&e.URL&&e.URL.createObjectURL);function r(){}function l(t){var a=n.exports.Promise,i=void 0!==a?a:e.Promise;return"function"==typeof i?new i(t):(t(r,r),null)}var c,s,u,d,f,h,m,g,b,v=(u=Math.floor(1e3/60),d={},f=0,"function"==typeof requestAnimationFrame&&"function"==typeof cancelAnimationFrame?(c=function(t){var e=Math.random();return d[e]=requestAnimationFrame((function n(a){f===a||f+u-1<a?(f=a,delete d[e],t()):d[e]=requestAnimationFrame(n)})),e},s=function(t){d[t]&&cancelAnimationFrame(d[t])}):(c=function(t){return setTimeout(t,u)},s=function(t){return clearTimeout(t)}),{frame:c,cancel:s}),p=(g={},function(){if(h)return h;if(!a&&o){var e=["var CONFETTI, SIZE = {}, module = {};","("+t.toString()+")(this, module, true, SIZE);","onmessage = function(msg) {","  if (msg.data.options) {","    CONFETTI(msg.data.options).then(function () {","      if (msg.data.callback) {","        postMessage({ callback: msg.data.callback });","      }","    });","  } else if (msg.data.reset) {","    CONFETTI.reset();","  } else if (msg.data.resize) {","    SIZE.width = msg.data.resize.width;","    SIZE.height = msg.data.resize.height;","  } else if (msg.data.canvas) {","    SIZE.width = msg.data.canvas.width;","    SIZE.height = msg.data.canvas.height;","    CONFETTI = module.exports.create(msg.data.canvas);","  }","}"].join("\n");try{h=new Worker(URL.createObjectURL(new Blob([e])))}catch(t){return void 0!==typeof console&&"function"==typeof console.warn&&console.warn("🎊 Could not load worker",t),null}!function(t){function e(e,n){t.postMessage({options:e||{},callback:n})}t.init=function(e){var n=e.transferControlToOffscreen();t.postMessage({canvas:n},[n])},t.fire=function(n,a,i){if(m)return e(n,null),m;var o=Math.random().toString(36).slice(2);return m=l((function(a){function r(e){e.data.callback===o&&(delete g[o],t.removeEventListener("message",r),m=null,i(),a())}t.addEventListener("message",r),e(n,o),g[o]=r.bind(null,{data:{callback:o}})}))},t.reset=function(){for(var e in t.postMessage({reset:!0}),g)g[e](),delete g[e]}}(h)}return h}),y={particleCount:50,angle:90,spread:45,startVelocity:45,decay:.9,gravity:1,drift:0,ticks:200,x:.5,y:.5,shapes:["square","circle"],zIndex:100,colors:["#26ccff","#a25afd","#ff5e7e","#88ff5a","#fcff42","#ffa62d","#ff36ff"],disableForReducedMotion:!1,scalar:1};function M(t,e,n){return function(t,e){return e?e(t):t}(t&&null!=t[e]?t[e]:y[e],n)}function w(t){return t<0?0:Math.floor(t)}function x(t){return parseInt(t,16)}function C(t){return t.map(k)}function k(t){var e=String(t).replace(/[^0-9a-f]/gi,"");return e.length<6&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),{r:x(e.substring(0,2)),g:x(e.substring(2,4)),b:x(e.substring(4,6))}}function I(t){t.width=document.documentElement.clientWidth,t.height=document.documentElement.clientHeight}function S(t){var e=t.getBoundingClientRect();t.width=e.width,t.height=e.height}function T(t,e,n,o,r){var c,s,u=e.slice(),d=t.getContext("2d"),f=l((function(e){function l(){c=s=null,d.clearRect(0,0,o.width,o.height),r(),e()}c=v.frame((function e(){!a||o.width===i.width&&o.height===i.height||(o.width=t.width=i.width,o.height=t.height=i.height),o.width||o.height||(n(t),o.width=t.width,o.height=t.height),d.clearRect(0,0,o.width,o.height),u=u.filter((function(t){return function(t,e){e.x+=Math.cos(e.angle2D)*e.velocity+e.drift,e.y+=Math.sin(e.angle2D)*e.velocity+e.gravity,e.wobble+=e.wobbleSpeed,e.velocity*=e.decay,e.tiltAngle+=.1,e.tiltSin=Math.sin(e.tiltAngle),e.tiltCos=Math.cos(e.tiltAngle),e.random=Math.random()+2,e.wobbleX=e.x+10*e.scalar*Math.cos(e.wobble),e.wobbleY=e.y+10*e.scalar*Math.sin(e.wobble);var n=e.tick++/e.totalTicks,a=e.x+e.random*e.tiltCos,i=e.y+e.random*e.tiltSin,o=e.wobbleX+e.random*e.tiltCos,r=e.wobbleY+e.random*e.tiltSin;return t.fillStyle="rgba("+e.color.r+", "+e.color.g+", "+e.color.b+", "+(1-n)+")",t.beginPath(),"circle"===e.shape?t.ellipse?t.ellipse(e.x,e.y,Math.abs(o-a)*e.ovalScalar,Math.abs(r-i)*e.ovalScalar,Math.PI/10*e.wobble,0,2*Math.PI):function(t,e,n,a,i,o,r,l,c){t.save(),t.translate(e,n),t.rotate(o),t.scale(a,i),t.arc(0,0,1,r,l,c),t.restore()}(t,e.x,e.y,Math.abs(o-a)*e.ovalScalar,Math.abs(r-i)*e.ovalScalar,Math.PI/10*e.wobble,0,2*Math.PI):(t.moveTo(Math.floor(e.x),Math.floor(e.y)),t.lineTo(Math.floor(e.wobbleX),Math.floor(i)),t.lineTo(Math.floor(o),Math.floor(r)),t.lineTo(Math.floor(a),Math.floor(e.wobbleY))),t.closePath(),t.fill(),e.tick<e.totalTicks}(d,t)})),u.length?c=v.frame(e):l()})),s=l}));return{addFettis:function(t){return u=u.concat(t),f},canvas:t,promise:f,reset:function(){c&&v.cancel(c),s&&s()}}}function E(t,n){var a,i=!t,r=!!M(n||{},"resize"),c=M(n,"disableForReducedMotion",Boolean),s=o&&!!M(n||{},"useWorker")?p():null,u=i?I:S,d=!(!t||!s)&&!!t.__confetti_initialized,f="function"==typeof matchMedia&&matchMedia("(prefers-reduced-motion)").matches;function h(e,n,i){for(var o,r,l,c,s,d=M(e,"particleCount",w),f=M(e,"angle",Number),h=M(e,"spread",Number),m=M(e,"startVelocity",Number),g=M(e,"decay",Number),b=M(e,"gravity",Number),v=M(e,"drift",Number),p=M(e,"colors",C),y=M(e,"ticks",Number),x=M(e,"shapes"),k=M(e,"scalar"),I=function(t){var e=M(t,"origin",Object);return e.x=M(e,"x",Number),e.y=M(e,"y",Number),e}(e),S=d,E=[],F=t.width*I.x,N=t.height*I.y;S--;)E.push((o={x:F,y:N,angle:f,spread:h,startVelocity:m,color:p[S%p.length],shape:x[(c=0,s=x.length,Math.floor(Math.random()*(s-c))+c)],ticks:y,decay:g,gravity:b,drift:v,scalar:k},r=void 0,l=void 0,r=o.angle*(Math.PI/180),l=o.spread*(Math.PI/180),{x:o.x,y:o.y,wobble:10*Math.random(),wobbleSpeed:Math.min(.11,.1*Math.random()+.05),velocity:.5*o.startVelocity+Math.random()*o.startVelocity,angle2D:-r+(.5*l-Math.random()*l),tiltAngle:(.5*Math.random()+.25)*Math.PI,color:o.color,shape:o.shape,tick:0,totalTicks:o.ticks,decay:o.decay,drift:o.drift,random:Math.random()+2,tiltSin:0,tiltCos:0,wobbleX:0,wobbleY:0,gravity:3*o.gravity,ovalScalar:.6,scalar:o.scalar}));return a?a.addFettis(E):(a=T(t,E,u,n,i)).promise}function m(n){var o=c||M(n,"disableForReducedMotion",Boolean),m=M(n,"zIndex",Number);if(o&&f)return l((function(t){t()}));i&&a?t=a.canvas:i&&!t&&(t=function(t){var e=document.createElement("canvas");return e.style.position="fixed",e.style.top="0px",e.style.left="0px",e.style.pointerEvents="none",e.style.zIndex=t,e}(m),document.body.appendChild(t)),r&&!d&&u(t);var g={width:t.width,height:t.height};function b(){if(s){var e={getBoundingClientRect:function(){if(!i)return t.getBoundingClientRect()}};return u(e),void s.postMessage({resize:{width:e.width,height:e.height}})}g.width=g.height=null}function v(){a=null,r&&e.removeEventListener("resize",b),i&&t&&(document.body.removeChild(t),t=null,d=!1)}return s&&!d&&s.init(t),d=!0,s&&(t.__confetti_initialized=!0),r&&e.addEventListener("resize",b,!1),s?s.fire(n,g,v):h(n,g,v)}return m.reset=function(){s&&s.reset(),a&&a.reset()},m}function F(){return b||(b=E(null,{useWorker:!0,resize:!0})),b}n.exports=function(){return F().apply(this,arguments)},n.exports.reset=function(){F().reset()},n.exports.create=E}(function(){return void 0!==t?t:"undefined"!=typeof self?self:this||{}}(),e,!1),t.confetti=e.exports}(window,{});
//# sourceMappingURL=/sm/ab60d7fb9bf5b5ded42c77782b65b071de85f56c21da42948364d6b2b1961762.map

///////////////


/*
 * KineticJS JavaScript Framework v5.1.1
 * http://www.kineticjs.com/
 * Copyright 2013, Eric Rowell
 * Licensed under the MIT or GPL Version 2 licenses.
 * Date: 2014-10-03
 *
 * Copyright (C) 2011 - 2013 by Eric Rowell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * @namespace Kinetic
 */
/*jshint -W079, -W020*/
var Kinetic = {};
(function(root) {
    var PI_OVER_180 = Math.PI / 180;

    Kinetic = {
        // public
        version: '5.1.1',

        // private
        stages: [],
        idCounter: 0,
        ids: {},
        names: {},
        shapes: {},
        listenClickTap: false,
        inDblClickWindow: false,

        // configurations
        enableTrace: false,
        traceArrMax: 100,
        dblClickWindow: 400,
        /**
         * Global pixel ratio configuration. KineticJS automatically detect pixel ratio of current device.
         * But you may override such property, if you want to use your value.
         * @property pixelRatio
         * @default undefined
         * @memberof Kinetic
         * @example
         * Kinetic.pixelRatio = 1;
         */
        pixelRatio: undefined,
        /**
         * Drag distance property. If you start to drag a node you may want to wait until pointer is moved to some distance from start point,
         * only then start dragging.
         * @property dragDistance
         * @default 0
         * @memberof Kinetic
         * @example
         * Kinetic.dragDistance = 10;
         */
        dragDistance : 0,
        /**
         * Use degree values for angle properties. You may set this property to false if you want to use radiant values.
         * @property angleDeg
         * @default true
         * @memberof Kinetic
         * @example
         * node.rotation(45); // 45 degrees
         * Kinetic.angleDeg = false;
         * node.rotation(Math.PI / 2); // PI/2 radian
         */
        angleDeg: true,
         /**
         * Show different warnings about errors or wrong API usage
         * @property showWarnings
         * @default true
         * @memberof Kinetic
         * @example
         * Kinetic.showWarnings = false;
         */
        showWarnings : true,



        /**
         * @namespace Filters
         * @memberof Kinetic
         */
        Filters: {},

        /**
         * Node constructor. Nodes are entities that can be transformed, layered,
         * and have bound events. The stage, layers, groups, and shapes all extend Node.
         * @constructor
         * @memberof Kinetic
         * @abstract
         * @param {Object} config
         * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
         */
        Node: function(config) {
            this._init(config);
        },

        /**
         * Shape constructor.  Shapes are primitive objects such as rectangles,
         *  circles, text, lines, etc.
         * @constructor
         * @memberof Kinetic
         * @augments Kinetic.Node
         * @param {Object} config
         * @param {String} [config.fill] fill color
     * @param {Integer} [config.fillRed] set fill red component
     * @param {Integer} [config.fillGreen] set fill green component
     * @param {Integer} [config.fillBlue] set fill blue component
     * @param {Integer} [config.fillAlpha] set fill alpha component
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX]
     * @param {Number} [config.fillPatternOffsetY]
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX]
     * @param {Number} [config.fillRadialGradientEndPointY]
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Integer} [config.strokeRed] set stroke red component
     * @param {Integer} [config.strokeGreen] set stroke green component
     * @param {Integer} [config.strokeBlue] set stroke blue component
     * @param {Integer} [config.strokeAlpha] set stroke alpha component
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Integer} [config.shadowRed] set shadow color red component
     * @param {Integer} [config.shadowGreen] set shadow color green component
     * @param {Integer} [config.shadowBlue] set shadow color blue component
     * @param {Integer} [config.shadowAlpha] set shadow color alpha component
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
         * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
         * @example
         * var customShape = new Kinetic.Shape({
         *   x: 5,
         *   y: 10,
         *   fill: 'red',
         *   // a Kinetic.Canvas renderer is passed into the drawFunc function
         *   drawFunc: function(context) {
         *     context.beginPath();
         *     context.moveTo(200, 50);
         *     context.lineTo(420, 80);
         *     context.quadraticCurveTo(300, 100, 260, 170);
         *     context.closePath();
         *     context.fillStrokeShape(this);
         *   }
         *});
         */
        Shape: function(config) {
            this.__init(config);
        },

        /**
         * Container constructor.&nbsp; Containers are used to contain nodes or other containers
         * @constructor
         * @memberof Kinetic
         * @augments Kinetic.Node
         * @abstract
         * @param {Object} config
         * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
         * * @param {Object} [config.clip] set clip
     * @param {Number} [config.clipX] set clip x
     * @param {Number} [config.clipY] set clip y
     * @param {Number} [config.clipWidth] set clip width
     * @param {Number} [config.clipHeight] set clip height

         */
        Container: function(config) {
            this.__init(config);
        },

        /**
         * Stage constructor.  A stage is used to contain multiple layers
         * @constructor
         * @memberof Kinetic
         * @augments Kinetic.Container
         * @param {Object} config
         * @param {String|Element} config.container Container id or DOM element
         * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
         * @example
         * var stage = new Kinetic.Stage({
         *   width: 500,
         *   height: 800,
         *   container: 'containerId'
         * });
         */
        Stage: function(config) {
            this.___init(config);
        },

        /**
         * BaseLayer constructor.
         * @constructor
         * @memberof Kinetic
         * @augments Kinetic.Container
         * @param {Object} config
         * @param {Boolean} [config.clearBeforeDraw] set this property to false if you don't want
         * to clear the canvas before each layer draw.  The default value is true.
         * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
         * * @param {Object} [config.clip] set clip
     * @param {Number} [config.clipX] set clip x
     * @param {Number} [config.clipY] set clip y
     * @param {Number} [config.clipWidth] set clip width
     * @param {Number} [config.clipHeight] set clip height

         * @example
         * var layer = new Kinetic.Layer();
         */
        BaseLayer: function(config) {
            this.___init(config);
        },

        /**
         * Layer constructor.  Layers are tied to their own canvas element and are used
         * to contain groups or shapes.
         * @constructor
         * @memberof Kinetic
         * @augments Kinetic.BaseLayer
         * @param {Object} config
         * @param {Boolean} [config.clearBeforeDraw] set this property to false if you don't want
         * to clear the canvas before each layer draw.  The default value is true.
         * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
         * * @param {Object} [config.clip] set clip
     * @param {Number} [config.clipX] set clip x
     * @param {Number} [config.clipY] set clip y
     * @param {Number} [config.clipWidth] set clip width
     * @param {Number} [config.clipHeight] set clip height

         * @example
         * var layer = new Kinetic.Layer();
         */
        Layer: function(config) {
            this.____init(config);
        },

        /**
         * FastLayer constructor. Layers are tied to their own canvas element and are used
         * to contain shapes only.  If you don't need node nesting, mouse and touch interactions,
         * or event pub/sub, you should use FastLayer instead of Layer to create your layers.
         * It renders about 2x faster than normal layers.
         * @constructor
         * @memberof Kinetic
         * @augments Kinetic.BaseLayer
         * @param {Object} config
         * @param {Boolean} [config.clearBeforeDraw] set this property to false if you don't want
         * to clear the canvas before each layer draw.  The default value is true.
         * @param {Boolean} [config.visible]
         * @param {String} [config.id] unique id
         * @param {String} [config.name] non-unique name
         * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
         * * @param {Object} [config.clip] set clip
     * @param {Number} [config.clipX] set clip x
     * @param {Number} [config.clipY] set clip y
     * @param {Number} [config.clipWidth] set clip width
     * @param {Number} [config.clipHeight] set clip height

         * @example
         * var layer = new Kinetic.FastLayer();
         */
        FastLayer: function(config) {
            this.____init(config);
        },

        /**
         * Group constructor.  Groups are used to contain shapes or other groups.
         * @constructor
         * @memberof Kinetic
         * @augments Kinetic.Container
         * @param {Object} config
         * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
         * * @param {Object} [config.clip] set clip
     * @param {Number} [config.clipX] set clip x
     * @param {Number} [config.clipY] set clip y
     * @param {Number} [config.clipWidth] set clip width
     * @param {Number} [config.clipHeight] set clip height

         * @example
         * var group = new Kinetic.Group();
         */
        Group: function(config) {
            this.___init(config);
        },

        /**
         * returns whether or not drag and drop is currently active
         * @method
         * @memberof Kinetic
         */
        isDragging: function() {
            var dd = Kinetic.DD;

            // if DD is not included with the build, then
            // drag and drop is not even possible
            if (dd) {
                return dd.isDragging;
            } else {
                return false;
            }
        },
        /**
        * returns whether or not a drag and drop operation is ready, but may
        *  not necessarily have started
        * @method
        * @memberof Kinetic
        */
        isDragReady: function() {
            var dd = Kinetic.DD;

            // if DD is not included with the build, then
            // drag and drop is not even possible
            if (dd) {
                return !!dd.node;
            } else {
                return false;
            }
        },
        _addId: function(node, id) {
            if(id !== undefined) {
                this.ids[id] = node;
            }
        },
        _removeId: function(id) {
            if(id !== undefined) {
                delete this.ids[id];
            }
        },
        _addName: function(node, name) {
            if(name !== undefined) {
                var names = name.split(/\W+/g);
                for(var n = 0; n < names.length; n++) {
                    if (names[n]) {
                        if(this.names[names[n]] === undefined) {
                            this.names[names[n]] = [];
                        }
                        this.names[names[n]].push(node);
                    }
                }
            }
        },
        _removeName: function(name, _id) {
            if(name !== undefined) {
                var nodes = this.names[name];
                if(nodes !== undefined) {
                    for(var n = 0; n < nodes.length; n++) {
                        var no = nodes[n];
                        if(no._id === _id) {
                            nodes.splice(n, 1);
                        }
                    }
                    if(nodes.length === 0) {
                        delete this.names[name];
                    }
                }
            }
        },
        getAngle: function(angle) {
            return this.angleDeg ? angle * PI_OVER_180 : angle;
        },
        _parseUA: function(userAgent) {
            var ua = userAgent.toLowerCase(),
                // jQuery UA regex
                match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
                /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
                /(msie) ([\w.]+)/.exec( ua ) ||
                ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
                [],

                // adding mobile flag as well
                mobile = !!(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)),
                ieMobile = !!(userAgent.match(/IEMobile/i));

            return {
                browser: match[ 1 ] || '',
                version: match[ 2 ] || '0',

                // adding mobile flab
                mobile: mobile,
                ieMobile: ieMobile  // If this is true (i.e., WP8), then Kinetic touch events are executed instead of equivalent Kinetic mouse events
            };
        },
        // user agent
        UA: undefined
    };

    Kinetic.UA = Kinetic._parseUA((root.navigator && root.navigator.userAgent) || '');

})(this);

// Uses Node, AMD or browser globals to create a module.

// If you want something that will work in other stricter CommonJS environments,
// or if you need to create a circular dependency, see commonJsStrict.js

// Defines a module "returnExports" that depends another module called "b".
// Note that the name of the module is implied by the file name. It is best
// if the file name and the exported global have matching names.

// If the 'b' module also uses this type of boilerplate, then
// in the browser, it will create a global .b that is used below.

// If you do not want to support the browser global path, then you
// can remove the `root` use and the passing `this` as the first arg to
// the top function.

// if the module has no dependencies, the above pattern can be simplified to
( function(root, factory) {
    if( typeof exports === 'object') {
        var KineticJS = factory();
        // runtime-check for browserify
        if(global.window === global) {
            Kinetic.document = global.document;
            Kinetic.window = global;
        } else {
            // Node. Does not work with strict CommonJS, but
            // only CommonJS-like enviroments that support module.exports,
            // like Node.
            var Canvas = require('canvas');
            var jsdom = require('jsdom').jsdom;

            Kinetic.document = jsdom('<!DOCTYPE html><html><head></head><body></body></html>');
            Kinetic.window = Kinetic.document.createWindow();
            Kinetic.window.Image = Canvas.Image;
            Kinetic._nodeCanvas = Canvas;
        }

        Kinetic.root = root;
        module.exports = KineticJS;
        return;
    }
    else if( typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    }
    Kinetic.document = document;
    Kinetic.window = window;
    Kinetic.root = root;

}(this, function() {

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return Kinetic;
}));
;(function() {
    /**
     * Collection constructor.  Collection extends
     *  Array.  This class is used in conjunction with {@link Kinetic.Container#get}
     * @constructor
     * @memberof Kinetic
     */
    Kinetic.Collection = function() {
        var args = [].slice.call(arguments), length = args.length, i = 0;

        this.length = length;
        for(; i < length; i++) {
            this[i] = args[i];
        }
        return this;
    };
    Kinetic.Collection.prototype = [];
    /**
     * iterate through node array and run a function for each node.
     *  The node and index is passed into the function
     * @method
     * @memberof Kinetic.Collection.prototype
     * @param {Function} func
     * @example
     * // get all nodes with name foo inside layer, and set x to 10 for each
     * layer.get('.foo').each(function(shape, n) {
     *   shape.setX(10);
     * });
     */
    Kinetic.Collection.prototype.each = function(func) {
        for(var n = 0; n < this.length; n++) {
            func(this[n], n);
        }
    };
    /**
     * convert collection into an array
     * @method
     * @memberof Kinetic.Collection.prototype
     */
    Kinetic.Collection.prototype.toArray = function() {
        var arr = [],
            len = this.length,
            n;

        for(n = 0; n < len; n++) {
            arr.push(this[n]);
        }
        return arr;
    };
    /**
     * convert array into a collection
     * @method
     * @memberof Kinetic.Collection
     * @param {Array} arr
     */
    Kinetic.Collection.toCollection = function(arr) {
        var collection = new Kinetic.Collection(),
            len = arr.length,
            n;

        for(n = 0; n < len; n++) {
            collection.push(arr[n]);
        }
        return collection;
    };

    // map one method by it's name
    Kinetic.Collection._mapMethod = function(methodName) {
        Kinetic.Collection.prototype[methodName] = function() {
            var len = this.length,
                i;

            var args = [].slice.call(arguments);
            for(i = 0; i < len; i++) {
                this[i][methodName].apply(this[i], args);
            }

            return this;
        };
    };

    Kinetic.Collection.mapMethods = function(constructor) {
        var prot = constructor.prototype;
        for(var methodName in prot) {
            Kinetic.Collection._mapMethod(methodName);
        }
    };

    /*
    * Last updated November 2011
    * By Simon Sarris
    * www.simonsarris.com
    * sarris@acm.org
    *
    * Free to use and distribute at will
    * So long as you are nice to people, etc
    */

    /*
    * The usage of this class was inspired by some of the work done by a forked
    * project, KineticJS-Ext by Wappworks, which is based on Simon's Transform
    * class.  Modified by Eric Rowell
    */

    /**
     * Transform constructor
     * @constructor
     * @param {Array} [m] Optional six-element matrix
     * @memberof Kinetic
     */
    Kinetic.Transform = function(m) {
        this.m = (m && m.slice()) || [1, 0, 0, 1, 0, 0];
    };

    Kinetic.Transform.prototype = {
        /**
         * Copy Kinetic.Transform object
         * @method
         * @memberof Kinetic.Transform.prototype
         * @returns {Kinetic.Transform}
         */
        copy: function() {
            return new Kinetic.Transform(this.m);
        },
        /**
         * Transform point
         * @method
         * @memberof Kinetic.Transform.prototype
         * @param {Object} point 2D point(x, y)
         * @returns {Object} 2D point(x, y)
         */
        point: function(point) {
            var m = this.m;
            return {
                x: m[0] * point.x + m[2] * point.y + m[4],
                y: m[1] * point.x + m[3] * point.y + m[5]
            };
        },
        /**
         * Apply translation
         * @method
         * @memberof Kinetic.Transform.prototype
         * @param {Number} x
         * @param {Number} y
         * @returns {Kinetic.Transform}
         */
        translate: function(x, y) {
            this.m[4] += this.m[0] * x + this.m[2] * y;
            this.m[5] += this.m[1] * x + this.m[3] * y;
            return this;
        },
        /**
         * Apply scale
         * @method
         * @memberof Kinetic.Transform.prototype
         * @param {Number} sx
         * @param {Number} sy
         * @returns {Kinetic.Transform}
         */
        scale: function(sx, sy) {
            this.m[0] *= sx;
            this.m[1] *= sx;
            this.m[2] *= sy;
            this.m[3] *= sy;
            return this;
        },
        /**
         * Apply rotation
         * @method
         * @memberof Kinetic.Transform.prototype
         * @param {Number} rad  Angle in radians
         * @returns {Kinetic.Transform}
         */
        rotate: function(rad) {
            var c = Math.cos(rad);
            var s = Math.sin(rad);
            var m11 = this.m[0] * c + this.m[2] * s;
            var m12 = this.m[1] * c + this.m[3] * s;
            var m21 = this.m[0] * -s + this.m[2] * c;
            var m22 = this.m[1] * -s + this.m[3] * c;
            this.m[0] = m11;
            this.m[1] = m12;
            this.m[2] = m21;
            this.m[3] = m22;
            return this;
        },
        /**
         * Returns the translation
         * @method
         * @memberof Kinetic.Transform.prototype
         * @returns {Object} 2D point(x, y)
         */
        getTranslation: function() {
            return {
                x: this.m[4],
                y: this.m[5]
            };
        },
        /**
         * Apply skew
         * @method
         * @memberof Kinetic.Transform.prototype
         * @param {Number} sx
         * @param {Number} sy
         * @returns {Kinetic.Transform}
         */
        skew: function(sx, sy) {
            var m11 = this.m[0] + this.m[2] * sy;
            var m12 = this.m[1] + this.m[3] * sy;
            var m21 = this.m[2] + this.m[0] * sx;
            var m22 = this.m[3] + this.m[1] * sx;
            this.m[0] = m11;
            this.m[1] = m12;
            this.m[2] = m21;
            this.m[3] = m22;
            return this;
         },
        /**
         * Transform multiplication
         * @method
         * @memberof Kinetic.Transform.prototype
         * @param {Kinetic.Transform} matrix
         * @returns {Kinetic.Transform}
         */
        multiply: function(matrix) {
            var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
            var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];

            var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
            var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];

            var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
            var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];

            this.m[0] = m11;
            this.m[1] = m12;
            this.m[2] = m21;
            this.m[3] = m22;
            this.m[4] = dx;
            this.m[5] = dy;
            return this;
        },
        /**
         * Invert the matrix
         * @method
         * @memberof Kinetic.Transform.prototype
         * @returns {Kinetic.Transform}
         */
        invert: function() {
            var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
            var m0 = this.m[3] * d;
            var m1 = -this.m[1] * d;
            var m2 = -this.m[2] * d;
            var m3 = this.m[0] * d;
            var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
            var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
            this.m[0] = m0;
            this.m[1] = m1;
            this.m[2] = m2;
            this.m[3] = m3;
            this.m[4] = m4;
            this.m[5] = m5;
            return this;
        },
        /**
         * return matrix
         * @method
         * @memberof Kinetic.Transform.prototype
         */
        getMatrix: function() {
            return this.m;
        },
        /**
         * set to absolute position via translation
         * @method
         * @memberof Kinetic.Transform.prototype
         * @returns {Kinetic.Transform}
         * @author ericdrowell
         */
        setAbsolutePosition: function(x, y) {
            var m0 = this.m[0],
                m1 = this.m[1],
                m2 = this.m[2],
                m3 = this.m[3],
                m4 = this.m[4],
                m5 = this.m[5],
                yt = ((m0 * (y - m5)) - (m1 * (x - m4))) / ((m0 * m3) - (m1 * m2)),
                xt = (x - m4 - (m2 * yt)) / m0;

            return this.translate(xt, yt);
        }
    };

    // CONSTANTS
    var CONTEXT_2D = '2d',
        OBJECT_ARRAY = '[object Array]',
        OBJECT_NUMBER = '[object Number]',
        OBJECT_STRING = '[object String]',
        PI_OVER_DEG180 = Math.PI / 180,
        DEG180_OVER_PI = 180 / Math.PI,
        HASH = '#',
        EMPTY_STRING = '',
        ZERO = '0',
        KINETIC_WARNING = 'Kinetic warning: ',
        KINETIC_ERROR = 'Kinetic error: ',
        RGB_PAREN = 'rgb(',
        COLORS = {
            aqua: [0,255,255],
            lime: [0,255,0],
            silver: [192,192,192],
            black: [0,0,0],
            maroon: [128,0,0],
            teal: [0,128,128],
            blue: [0,0,255],
            navy: [0,0,128],
            white: [255,255,255],
            fuchsia: [255,0,255],
            olive:[128,128,0],
            yellow: [255,255,0],
            orange: [255,165,0],
            gray: [128,128,128],
            purple: [128,0,128],
            green: [0,128,0],
            red: [255,0,0],
            pink: [255,192,203],
            cyan: [0,255,255],
            transparent: [255,255,255,0]
        },

        RGB_REGEX = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;

    /**
     * @namespace Util
     * @memberof Kinetic
     */
    Kinetic.Util = {
        /*
         * cherry-picked utilities from underscore.js
         */
        _isElement: function(obj) {
            return !!(obj && obj.nodeType == 1);
        },
        _isFunction: function(obj) {
            return !!(obj && obj.constructor && obj.call && obj.apply);
        },
        _isObject: function(obj) {
            return (!!obj && obj.constructor == Object);
        },
        _isArray: function(obj) {
            return Object.prototype.toString.call(obj) == OBJECT_ARRAY;
        },
        _isNumber: function(obj) {
            return Object.prototype.toString.call(obj) == OBJECT_NUMBER;
        },
        _isString: function(obj) {
            return Object.prototype.toString.call(obj) == OBJECT_STRING;
        },
        // Returns a function, that, when invoked, will only be triggered at most once
        // during a given window of time. Normally, the throttled function will run
        // as much as it can, without ever going more than once per `wait` duration;
        // but if you'd like to disable the execution on the leading edge, pass
        // `{leading: false}`. To disable execution on the trailing edge, ditto.
        _throttle: function(func, wait, opts) {
            var context, args, result;
            var timeout = null;
            var previous = 0;
            var options = opts || {};
            var later = function() {
                previous = options.leading === false ? 0 : new Date().getTime();
                timeout = null;
                result = func.apply(context, args);
                context = args = null;
            };
            return function() {
                var now = new Date().getTime();
                if (!previous && options.leading === false) {
                    previous = now;
                }
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0) {
                  clearTimeout(timeout);
                  timeout = null;
                  previous = now;
                  result = func.apply(context, args);
                  context = args = null;
                } else if (!timeout && options.trailing !== false) {
                  timeout = setTimeout(later, remaining);
                }
                return result;
            };
        },
        /*
         * other utils
         */
        _hasMethods: function(obj) {
            var names = [],
                key;

            for(key in obj) {
                if(this._isFunction(obj[key])) {
                    names.push(key);
                }
            }
            return names.length > 0;
        },
        createCanvasElement: function() {
            var canvas = Kinetic.document.createElement('canvas');
            // on some environments canvas.style is readonly
            try {
                canvas.style = canvas.style || {};
            } catch (e) {
            }
            return canvas;
        },
        isBrowser: function() {
            return (typeof exports !==  'object');
        },
        _isInDocument: function(el) {
            while(el = el.parentNode) {
                if(el == Kinetic.document) {
                    return true;
                }
            }
            return false;
        },
        _simplifyArray: function(arr) {
            var retArr = [],
                len = arr.length,
                util = Kinetic.Util,
                n, val;

            for (n=0; n<len; n++) {
                val = arr[n];
                if (util._isNumber(val)) {
                    val = Math.round(val * 1000) / 1000;
                }
                else if (!util._isString(val)) {
                    val = val.toString();
                }

                retArr.push(val);
            }

            return retArr;
        },
        /*
         * arg can be an image object or image data
         */
        _getImage: function(arg, callback) {
            var imageObj, canvas;

            // if arg is null or undefined
            if(!arg) {
                callback(null);
            }

            // if arg is already an image object
            else if(this._isElement(arg)) {
                callback(arg);
            }

            // if arg is a string, then it's a data url
            else if(this._isString(arg)) {
                imageObj = new Kinetic.window.Image();
                imageObj.onload = function() {
                    callback(imageObj);
                };
                imageObj.src = arg;
            }

            //if arg is an object that contains the data property, it's an image object
            else if(arg.data) {
                canvas = Kinetic.Util.createCanvasElement();
                canvas.width = arg.width;
                canvas.height = arg.height;
                var _context = canvas.getContext(CONTEXT_2D);
                _context.putImageData(arg, 0, 0);
                this._getImage(canvas.toDataURL(), callback);
            }
            else {
                callback(null);
            }
        },
        _getRGBAString: function(obj) {
            var red = obj.red || 0,
                green = obj.green || 0,
                blue = obj.blue || 0,
                alpha = obj.alpha || 1;

            return [
                'rgba(',
                red,
                ',',
                green,
                ',',
                blue,
                ',',
                alpha,
                ')'
            ].join(EMPTY_STRING);
        },
        _rgbToHex: function(r, g, b) {
            return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },
        _hexToRgb: function(hex) {
            hex = hex.replace(HASH, EMPTY_STRING);
            var bigint = parseInt(hex, 16);
            return {
                r: (bigint >> 16) & 255,
                g: (bigint >> 8) & 255,
                b: bigint & 255
            };
        },
        /**
         * return random hex color
         * @method
         * @memberof Kinetic.Util.prototype
         */
        getRandomColor: function() {
            var randColor = (Math.random() * 0xFFFFFF << 0).toString(16);
            while (randColor.length < 6) {
                randColor = ZERO + randColor;
            }
            return HASH + randColor;
        },
        /**
         * return value with default fallback
         * @method
         * @memberof Kinetic.Util.prototype
         */
        get: function(val, def) {
            if (val === undefined) {
                return def;
            }
            else {
                return val;
            }
        },
        /**
         * get RGB components of a color
         * @method
         * @memberof Kinetic.Util.prototype
         * @param {String} color
         * @example
         * // each of the following examples return {r:0, g:0, b:255}
         * var rgb = Kinetic.Util.getRGB('blue');
         * var rgb = Kinetic.Util.getRGB('#0000ff');
         * var rgb = Kinetic.Util.getRGB('rgb(0,0,255)');
         */
        getRGB: function(color) {
            var rgb;
            // color string
            if (color in COLORS) {
                rgb = COLORS[color];
                return {
                    r: rgb[0],
                    g: rgb[1],
                    b: rgb[2]
                };
            }
            // hex
            else if (color[0] === HASH) {
                return this._hexToRgb(color.substring(1));
            }
            // rgb string
            else if (color.substr(0, 4) === RGB_PAREN) {
                rgb = RGB_REGEX.exec(color.replace(/ /g,''));
                return {
                    r: parseInt(rgb[1], 10),
                    g: parseInt(rgb[2], 10),
                    b: parseInt(rgb[3], 10)
                };
            }
            // default
            else {
                return {
                    r: 0,
                    g: 0,
                    b: 0
                };
            }
        },
        // o1 takes precedence over o2
        _merge: function(o1, o2) {
            var retObj = this._clone(o2);
            for(var key in o1) {
                if(this._isObject(o1[key])) {
                    retObj[key] = this._merge(o1[key], retObj[key]);
                }
                else {
                    retObj[key] = o1[key];
                }
            }
            return retObj;
        },
        cloneObject: function(obj) {
            var retObj = {};
            for(var key in obj) {
                if(this._isObject(obj[key])) {
                    retObj[key] = this.cloneObject(obj[key]);
                }
                else if (this._isArray(obj[key])) {
                    retObj[key] = this.cloneArray(obj[key]);
                } else {
                    retObj[key] = obj[key];
                }
            }
            return retObj;
        },
        cloneArray: function(arr) {
            return arr.slice(0);
        },
        _degToRad: function(deg) {
            return deg * PI_OVER_DEG180;
        },
        _radToDeg: function(rad) {
            return rad * DEG180_OVER_PI;
        },
        _capitalize: function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        error: function(str) {
            throw new Error(KINETIC_ERROR + str);
        },
        warn: function(str) {
            /*
             * IE9 on Windows7 64bit will throw a JS error
             * if we don't use window.console in the conditional
             */
            if(Kinetic.root.console && console.warn && Kinetic.showWarnings) {
                console.warn(KINETIC_WARNING + str);
            }
        },
        extend: function(c1, c2) {
            for(var key in c2.prototype) {
                if(!( key in c1.prototype)) {
                    c1.prototype[key] = c2.prototype[key];
                }
            }
        },
        /**
         * adds methods to a constructor prototype
         * @method
         * @memberof Kinetic.Util.prototype
         * @param {Function} constructor
         * @param {Object} methods
         */
        addMethods: function(constructor, methods) {
            var key;

            for (key in methods) {
                constructor.prototype[key] = methods[key];
            }
        },
        _getControlPoints: function(x0, y0, x1, y1, x2, y2, t) {
            var d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)),
                d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
                fa = t * d01 / (d01 + d12),
                fb = t * d12 / (d01 + d12),
                p1x = x1 - fa * (x2 - x0),
                p1y = y1 - fa * (y2 - y0),
                p2x = x1 + fb * (x2 - x0),
                p2y = y1 + fb * (y2 - y0);

            return [p1x ,p1y, p2x, p2y];
        },
        _expandPoints: function(p, tension) {
            var len = p.length,
                allPoints = [],
                n, cp;

            for (n=2; n<len-2; n+=2) {
                cp = Kinetic.Util._getControlPoints(p[n-2], p[n-1], p[n], p[n+1], p[n+2], p[n+3], tension);
                allPoints.push(cp[0]);
                allPoints.push(cp[1]);
                allPoints.push(p[n]);
                allPoints.push(p[n+1]);
                allPoints.push(cp[2]);
                allPoints.push(cp[3]);
            }

            return allPoints;
        },
        _removeLastLetter: function(str) {
            return str.substring(0, str.length - 1);
        }
    };
})();
;(function() {
    // calculate pixel ratio
    var canvas = Kinetic.Util.createCanvasElement(),
        context = canvas.getContext('2d'),
        // if using a mobile device, calculate the pixel ratio.  Otherwise, just use
        // 1.  For desktop browsers, if the user has zoom enabled, it affects the pixel ratio
        // and causes artifacts on the canvas.  As of 02/26/2014, there doesn't seem to be a way
        // to reliably calculate the browser zoom for modern browsers, which is why we just set
        // the pixel ratio to 1 for desktops
        _pixelRatio = Kinetic.UA.mobile ? (function() {
            var devicePixelRatio = window.devicePixelRatio || 1,
            backingStoreRatio = context.webkitBackingStorePixelRatio
                || context.mozBackingStorePixelRatio
                || context.msBackingStorePixelRatio
                || context.oBackingStorePixelRatio
                || context.backingStorePixelRatio
                || 1;
            return devicePixelRatio / backingStoreRatio;
        })() : 1;

    /**
     * Canvas Renderer constructor
     * @constructor
     * @abstract
     * @memberof Kinetic
     * @param {Object} config
     * @param {Number} config.width
     * @param {Number} config.height
     * @param {Number} config.pixelRatio KineticJS automatically handles pixel ratio adjustments in order to render crisp drawings
     *  on all devices. Most desktops, low end tablets, and low end phones, have device pixel ratios
     *  of 1.  Some high end tablets and phones, like iPhones and iPads (not the mini) have a device pixel ratio
     *  of 2.  Some Macbook Pros, and iMacs also have a device pixel ratio of 2.  Some high end Android devices have pixel
     *  ratios of 2 or 3.  Some browsers like Firefox allow you to configure the pixel ratio of the viewport.  Unless otherwise
     *  specified, the pixel ratio will be defaulted to the actual device pixel ratio.  You can override the device pixel
     *  ratio for special situations, or, if you don't want the pixel ratio to be taken into account, you can set it to 1.
     */
    Kinetic.Canvas = function(config) {
        this.init(config);
    };

    Kinetic.Canvas.prototype = {
        init: function(config) {
            var conf = config || {};

            var pixelRatio = conf.pixelRatio || Kinetic.pixelRatio || _pixelRatio;

            this.pixelRatio = pixelRatio;
            this._canvas = Kinetic.Util.createCanvasElement();

            // set inline styles
            this._canvas.style.padding = 0;
            this._canvas.style.margin = 0;
            this._canvas.style.border = 0;
            this._canvas.style.background = 'transparent';
            this._canvas.style.position = 'absolute';
            this._canvas.style.top = 0;
            this._canvas.style.left = 0;
        },
        /**
         * get canvas context
         * @method
         * @memberof Kinetic.Canvas.prototype
         * @returns {CanvasContext} context
         */
        getContext: function() {
            return this.context;
        },
        /**
         * get pixel ratio
         * @method
         * @memberof Kinetic.Canvas.prototype
         * @returns {Number} pixel ratio
         */
        getPixelRatio: function() {
            return this.pixelRatio;
        },
        /**
         * get pixel ratio
         * @method
         * @memberof Kinetic.Canvas.prototype
         * @param {Number} pixelRatio KineticJS automatically handles pixel ratio adustments in order to render crisp drawings
         *  on all devices. Most desktops, low end tablets, and low end phones, have device pixel ratios
         *  of 1.  Some high end tablets and phones, like iPhones and iPads (not the mini) have a device pixel ratio
         *  of 2.  Some Macbook Pros, and iMacs also have a device pixel ratio of 2.  Some high end Android devices have pixel
         *  ratios of 2 or 3.  Some browsers like Firefox allow you to configure the pixel ratio of the viewport.  Unless otherwise
         *  specificed, the pixel ratio will be defaulted to the actual device pixel ratio.  You can override the device pixel
         *  ratio for special situations, or, if you don't want the pixel ratio to be taken into account, you can set it to 1.
         */
        setPixelRatio: function(pixelRatio) {
            this.pixelRatio = pixelRatio;
            this.setSize(this.getWidth(), this.getHeight());
        },
        /**
         * set width
         * @method
         * @memberof Kinetic.Canvas.prototype
         * @param {Number} width
         */
        setWidth: function(width) {
            // take into account pixel ratio
            this.width = this._canvas.width = width * this.pixelRatio;
            this._canvas.style.width = width + 'px';
        },
        /**
         * set height
         * @method
         * @memberof Kinetic.Canvas.prototype
         * @param {Number} height
         */
        setHeight: function(height) {
            // take into account pixel ratio
            this.height = this._canvas.height = height * this.pixelRatio;
            this._canvas.style.height = height + 'px';
        },
        /**
         * get width
         * @method
         * @memberof Kinetic.Canvas.prototype
         * @returns {Number} width
         */
        getWidth: function() {
            return this.width;
        },
        /**
         * get height
         * @method
         * @memberof Kinetic.Canvas.prototype
         * @returns {Number} height
         */
        getHeight: function() {
            return this.height;
        },
        /**
         * set size
         * @method
         * @memberof Kinetic.Canvas.prototype
         * @param {Number} width
         * @param {Number} height
         */
        setSize: function(width, height) {
            this.setWidth(width);
            this.setHeight(height);
        },
        /**
         * to data url
         * @method
         * @memberof Kinetic.Canvas.prototype
         * @param {String} mimeType
         * @param {Number} quality between 0 and 1 for jpg mime types
         * @returns {String} data url string
         */
        toDataURL: function(mimeType, quality) {
            try {
                // If this call fails (due to browser bug, like in Firefox 3.6),
                // then revert to previous no-parameter image/png behavior
                return this._canvas.toDataURL(mimeType, quality);
            }
            catch(e) {
                try {
                    return this._canvas.toDataURL();
                }
                catch(err) {
                    Kinetic.Util.warn('Unable to get data URL. ' + err.message);
                    return '';
                }
            }
        }
    };

    Kinetic.SceneCanvas = function(config) {
        var conf = config || {};
        var width = conf.width || 0,
            height = conf.height || 0;

        Kinetic.Canvas.call(this, conf);
        this.context = new Kinetic.SceneContext(this);
        this.setSize(width, height);
    };

    Kinetic.SceneCanvas.prototype = {
        setWidth: function(width) {
            var pixelRatio = this.pixelRatio,
                _context = this.getContext()._context;

            Kinetic.Canvas.prototype.setWidth.call(this, width);
            _context.scale(pixelRatio, pixelRatio);
        },
        setHeight: function(height) {
            var pixelRatio = this.pixelRatio,
                _context = this.getContext()._context;

            Kinetic.Canvas.prototype.setHeight.call(this, height);
            _context.scale(pixelRatio, pixelRatio);
        }
    };
    Kinetic.Util.extend(Kinetic.SceneCanvas, Kinetic.Canvas);

    Kinetic.HitCanvas = function(config) {
        var conf = config || {};
        var width = conf.width || 0,
            height = conf.height || 0;

        Kinetic.Canvas.call(this, conf);
        this.context = new Kinetic.HitContext(this);
        this.setSize(width, height);
        this.hitCanvas = true;
    };
    Kinetic.Util.extend(Kinetic.HitCanvas, Kinetic.Canvas);

})();
;(function() {
    var COMMA = ',',
        OPEN_PAREN = '(',
        CLOSE_PAREN = ')',
        OPEN_PAREN_BRACKET = '([',
        CLOSE_BRACKET_PAREN = '])',
        SEMICOLON = ';',
        DOUBLE_PAREN = '()',
        // EMPTY_STRING = '',
        EQUALS = '=',
        // SET = 'set',
        CONTEXT_METHODS = [
            'arc',
            'arcTo',
            'beginPath',
            'bezierCurveTo',
            'clearRect',
            'clip',
            'closePath',
            'createLinearGradient',
            'createPattern',
            'createRadialGradient',
            'drawImage',
            'fill',
            'fillText',
            'getImageData',
            'createImageData',
            'lineTo',
            'moveTo',
            'putImageData',
            'quadraticCurveTo',
            'rect',
            'restore',
            'rotate',
            'save',
            'scale',
            'setLineDash',
            'setTransform',
            'stroke',
            'strokeText',
            'transform',
            'translate'
        ];

    /**
     * Canvas Context constructor
     * @constructor
     * @abstract
     * @memberof Kinetic
     */
    Kinetic.Context = function(canvas) {
        this.init(canvas);
    };

    Kinetic.Context.prototype = {
        init: function(canvas) {
            this.canvas = canvas;
            this._context = canvas._canvas.getContext('2d');

            if (Kinetic.enableTrace) {
                this.traceArr = [];
                this._enableTrace();
            }
        },
        /**
         * fill shape
         * @method
         * @memberof Kinetic.Context.prototype
         * @param {Kinetic.Shape} shape
         */
        fillShape: function(shape) {
            if(shape.getFillEnabled()) {
                this._fill(shape);
            }
        },
        /**
         * stroke shape
         * @method
         * @memberof Kinetic.Context.prototype
         * @param {Kinetic.Shape} shape
         */
        strokeShape: function(shape) {
            if(shape.getStrokeEnabled()) {
                this._stroke(shape);
            }
        },
        /**
         * fill then stroke
         * @method
         * @memberof Kinetic.Context.prototype
         * @param {Kinetic.Shape} shape
         */
        fillStrokeShape: function(shape) {
            var fillEnabled = shape.getFillEnabled();
            if(fillEnabled) {
                this._fill(shape);
            }
            if(shape.getStrokeEnabled()) {
                this._stroke(shape);
            }
        },
        /**
         * get context trace if trace is enabled
         * @method
         * @memberof Kinetic.Context.prototype
         * @param {Boolean} relaxed if false, return strict context trace, which includes method names, method parameters
         *  properties, and property values.  If true, return relaxed context trace, which only returns method names and
         *  properites.
         * @returns {String}
         */
        getTrace: function(relaxed) {
            var traceArr = this.traceArr,
                len = traceArr.length,
                str = '',
                n, trace, method, args;

            for (n=0; n<len; n++) {
                trace = traceArr[n];
                method = trace.method;

                // methods
                if (method) {
                    args = trace.args;
                    str += method;
                    if (relaxed) {
                        str += DOUBLE_PAREN;
                    }
                    else {
                        if (Kinetic.Util._isArray(args[0])) {
                            str += OPEN_PAREN_BRACKET + args.join(COMMA) + CLOSE_BRACKET_PAREN;
                        }
                        else {
                            str += OPEN_PAREN + args.join(COMMA) + CLOSE_PAREN;
                        }
                    }
                }
                // properties
                else {
                    str += trace.property;
                    if (!relaxed) {
                        str += EQUALS + trace.val;
                    }
                }

                str += SEMICOLON;
            }

            return str;
        },
        /**
         * clear trace if trace is enabled
         * @method
         * @memberof Kinetic.Context.prototype
         */
        clearTrace: function() {
            this.traceArr = [];
        },
        _trace: function(str) {
            var traceArr = this.traceArr,
                len;

            traceArr.push(str);
            len = traceArr.length;

            if (len >= Kinetic.traceArrMax) {
                traceArr.shift();
            }
        },
        /**
         * reset canvas context transform
         * @method
         * @memberof Kinetic.Context.prototype
         */
        reset: function() {
            var pixelRatio = this.getCanvas().getPixelRatio();
            this.setTransform(1 * pixelRatio, 0, 0, 1 * pixelRatio, 0, 0);
        },
        /**
         * get canvas
         * @method
         * @memberof Kinetic.Context.prototype
         * @returns {Kinetic.Canvas}
         */
        getCanvas: function() {
            return this.canvas;
        },
        /**
         * clear canvas
         * @method
         * @memberof Kinetic.Context.prototype
         * @param {Object} [bounds]
         * @param {Number} [bounds.x]
         * @param {Number} [bounds.y]
         * @param {Number} [bounds.width]
         * @param {Number} [bounds.height]
         */
        clear: function(bounds) {
            var canvas = this.getCanvas();

            if (bounds) {
                this.clearRect(bounds.x || 0, bounds.y || 0, bounds.width || 0, bounds.height || 0);
            }
            else {
                this.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());
            }
        },
        _applyLineCap: function(shape) {
            var lineCap = shape.getLineCap();
            if(lineCap) {
                this.setAttr('lineCap', lineCap);
            }
        },
        _applyOpacity: function(shape) {
            var absOpacity = shape.getAbsoluteOpacity();
            if(absOpacity !== 1) {
                this.setAttr('globalAlpha', absOpacity);
            }
        },
        _applyLineJoin: function(shape) {
            var lineJoin = shape.getLineJoin();
            if(lineJoin) {
                this.setAttr('lineJoin', lineJoin);
            }
        },
        setAttr: function(attr, val) {
            this._context[attr] = val;
        },

        // context pass through methods
        arc: function() {
            var a = arguments;
            this._context.arc(a[0], a[1], a[2], a[3], a[4], a[5]);
        },
        beginPath: function() {
            this._context.beginPath();
        },
        bezierCurveTo: function() {
            var a = arguments;
            this._context.bezierCurveTo(a[0], a[1], a[2], a[3], a[4], a[5]);
        },
        clearRect: function() {
            var a = arguments;
            this._context.clearRect(a[0], a[1], a[2], a[3]);
        },
        clip: function() {
            this._context.clip();
        },
        closePath: function() {
            this._context.closePath();
        },
        createImageData: function() {
            var a = arguments;
            if(a.length === 2) {
                return this._context.createImageData(a[0], a[1]);
            }
            else if(a.length === 1) {
                return this._context.createImageData(a[0]);
            }
        },
        createLinearGradient: function() {
            var a = arguments;
            return this._context.createLinearGradient(a[0], a[1], a[2], a[3]);
        },
        createPattern: function() {
            var a = arguments;
            return this._context.createPattern(a[0], a[1]);
        },
        createRadialGradient: function() {
            var a = arguments;
            return this._context.createRadialGradient(a[0], a[1], a[2], a[3], a[4], a[5]);
        },
        drawImage: function() {
            var a = arguments,
                _context = this._context;

            if(a.length === 3) {
                _context.drawImage(a[0], a[1], a[2]);
            }
            else if(a.length === 5) {
                _context.drawImage(a[0], a[1], a[2], a[3], a[4]);
            }
            else if(a.length === 9) {
                _context.drawImage(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]);
            }
        },
        fill: function() {
            this._context.fill();
        },
        fillText: function() {
            var a = arguments;
            this._context.fillText(a[0], a[1], a[2]);
        },
        getImageData: function() {
            var a = arguments;
            return this._context.getImageData(a[0], a[1], a[2], a[3]);
        },
        lineTo: function() {
            var a = arguments;
            this._context.lineTo(a[0], a[1]);
        },
        moveTo: function() {
            var a = arguments;
            this._context.moveTo(a[0], a[1]);
        },
        rect: function() {
            var a = arguments;
            this._context.rect(a[0], a[1], a[2], a[3]);
        },
        putImageData: function() {
            var a = arguments;
            this._context.putImageData(a[0], a[1], a[2]);
        },
        quadraticCurveTo: function() {
            var a = arguments;
            this._context.quadraticCurveTo(a[0], a[1], a[2], a[3]);
        },
        restore: function() {
            this._context.restore();
        },
        rotate: function() {
            var a = arguments;
            this._context.rotate(a[0]);
        },
        save: function() {
            this._context.save();
        },
        scale: function() {
            var a = arguments;
            this._context.scale(a[0], a[1]);
        },
        setLineDash: function() {
            var a = arguments,
                _context = this._context;

            // works for Chrome and IE11
            if(this._context.setLineDash) {
                _context.setLineDash(a[0]);
            }
            // verified that this works in firefox
            else if('mozDash' in _context) {
                _context.mozDash = a[0];
            }
            // does not currently work for Safari
            else if('webkitLineDash' in _context) {
                _context.webkitLineDash = a[0];
            }

            // no support for IE9 and IE10
        },
        setTransform: function() {
            var a = arguments;
            this._context.setTransform(a[0], a[1], a[2], a[3], a[4], a[5]);
        },
        stroke: function() {
            this._context.stroke();
        },
        strokeText: function() {
            var a = arguments;
            this._context.strokeText(a[0], a[1], a[2]);
        },
        transform: function() {
            var a = arguments;
            this._context.transform(a[0], a[1], a[2], a[3], a[4], a[5]);
        },
        translate: function() {
            var a = arguments;
            this._context.translate(a[0], a[1]);
        },
        _enableTrace: function() {
            var that = this,
                len = CONTEXT_METHODS.length,
                _simplifyArray = Kinetic.Util._simplifyArray,
                origSetter = this.setAttr,
                n, args;

            // to prevent creating scope function at each loop
            var func = function(methodName) {
                    var origMethod = that[methodName],
                        ret;

                    that[methodName] = function() {
                        args = _simplifyArray(Array.prototype.slice.call(arguments, 0));
                        ret = origMethod.apply(that, arguments);

                        that._trace({
                            method: methodName,
                            args: args
                        });

                        return ret;
                    };
            };
            // methods
            for (n=0; n<len; n++) {
                func(CONTEXT_METHODS[n]);
            }

            // attrs
            that.setAttr = function() {
                origSetter.apply(that, arguments);
                that._trace({
                    property: arguments[0],
                    val: arguments[1]
                });
            };
        }
    };

    Kinetic.SceneContext = function(canvas) {
        Kinetic.Context.call(this, canvas);
    };

    Kinetic.SceneContext.prototype = {
        _fillColor: function(shape) {
            var fill = shape.fill()
                || Kinetic.Util._getRGBAString({
                    red: shape.fillRed(),
                    green: shape.fillGreen(),
                    blue: shape.fillBlue(),
                    alpha: shape.fillAlpha()
                });

            this.setAttr('fillStyle', fill);
            shape._fillFunc(this);
        },
        _fillPattern: function(shape) {
            var fillPatternImage = shape.getFillPatternImage(),
                fillPatternX = shape.getFillPatternX(),
                fillPatternY = shape.getFillPatternY(),
                fillPatternScale = shape.getFillPatternScale(),
                fillPatternRotation = Kinetic.getAngle(shape.getFillPatternRotation()),
                fillPatternOffset = shape.getFillPatternOffset(),
                fillPatternRepeat = shape.getFillPatternRepeat();

            if(fillPatternX || fillPatternY) {
                this.translate(fillPatternX || 0, fillPatternY || 0);
            }
            if(fillPatternRotation) {
                this.rotate(fillPatternRotation);
            }
            if(fillPatternScale) {
                this.scale(fillPatternScale.x, fillPatternScale.y);
            }
            if(fillPatternOffset) {
                this.translate(-1 * fillPatternOffset.x, -1 * fillPatternOffset.y);
            }

            this.setAttr('fillStyle', this.createPattern(fillPatternImage, fillPatternRepeat || 'repeat'));
            this.fill();
        },
        _fillLinearGradient: function(shape) {
            var start = shape.getFillLinearGradientStartPoint(),
                end = shape.getFillLinearGradientEndPoint(),
                colorStops = shape.getFillLinearGradientColorStops(),
                grd = this.createLinearGradient(start.x, start.y, end.x, end.y);

            if (colorStops) {
                // build color stops
                for(var n = 0; n < colorStops.length; n += 2) {
                    grd.addColorStop(colorStops[n], colorStops[n + 1]);
                }
                this.setAttr('fillStyle', grd);
                this.fill();
            }
        },
        _fillRadialGradient: function(shape) {
            var start = shape.getFillRadialGradientStartPoint(),
                end = shape.getFillRadialGradientEndPoint(),
                startRadius = shape.getFillRadialGradientStartRadius(),
                endRadius = shape.getFillRadialGradientEndRadius(),
                colorStops = shape.getFillRadialGradientColorStops(),
                grd = this.createRadialGradient(start.x, start.y, startRadius, end.x, end.y, endRadius);

            // build color stops
            for(var n = 0; n < colorStops.length; n += 2) {
                grd.addColorStop(colorStops[n], colorStops[n + 1]);
            }
            this.setAttr('fillStyle', grd);
            this.fill();
        },
        _fill: function(shape) {
            var hasColor = shape.fill() || shape.fillRed() || shape.fillGreen() || shape.fillBlue(),
                hasPattern = shape.getFillPatternImage(),
                hasLinearGradient = shape.getFillLinearGradientColorStops(),
                hasRadialGradient = shape.getFillRadialGradientColorStops(),
                fillPriority = shape.getFillPriority();

            // priority fills
            if(hasColor && fillPriority === 'color') {
                this._fillColor(shape);
            }
            else if(hasPattern && fillPriority === 'pattern') {
                this._fillPattern(shape);
            }
            else if(hasLinearGradient && fillPriority === 'linear-gradient') {
                this._fillLinearGradient(shape);
            }
            else if(hasRadialGradient && fillPriority === 'radial-gradient') {
                this._fillRadialGradient(shape);
            }
            // now just try and fill with whatever is available
            else if(hasColor) {
                this._fillColor(shape);
            }
            else if(hasPattern) {
                this._fillPattern(shape);
            }
            else if(hasLinearGradient) {
                this._fillLinearGradient(shape);
            }
            else if(hasRadialGradient) {
                this._fillRadialGradient(shape);
            }
        },
        _stroke: function(shape) {
            var dash = shape.dash(),
                strokeScaleEnabled = shape.getStrokeScaleEnabled();

            if(shape.hasStroke()) {
                if (!strokeScaleEnabled) {
                    this.save();
                    this.setTransform(1, 0, 0, 1, 0, 0);
                }

                this._applyLineCap(shape);
                if(dash && shape.dashEnabled()) {
                    this.setLineDash(dash);
                }

                this.setAttr('lineWidth', shape.strokeWidth());
                this.setAttr('strokeStyle', shape.stroke()
                    || Kinetic.Util._getRGBAString({
                        red: shape.strokeRed(),
                        green: shape.strokeGreen(),
                        blue: shape.strokeBlue(),
                        alpha: shape.strokeAlpha()
                    }));

                shape._strokeFunc(this);

                if (!strokeScaleEnabled) {
                    this.restore();
                }
            }
        },
        _applyShadow: function(shape) {
            var util = Kinetic.Util,
                absOpacity = shape.getAbsoluteOpacity(),
                color = util.get(shape.getShadowColor(), 'black'),
                blur = util.get(shape.getShadowBlur(), 5),
                shadowOpacity = util.get(shape.getShadowOpacity(), 1),
                offset = util.get(shape.getShadowOffset(), {
                    x: 0,
                    y: 0
                });

            if(shadowOpacity) {
                this.setAttr('globalAlpha', shadowOpacity * absOpacity);
            }

            this.setAttr('shadowColor', color);
            this.setAttr('shadowBlur', blur);
            this.setAttr('shadowOffsetX', offset.x);
            this.setAttr('shadowOffsetY', offset.y);

        }
    };
    Kinetic.Util.extend(Kinetic.SceneContext, Kinetic.Context);

    Kinetic.HitContext = function(canvas) {
        Kinetic.Context.call(this, canvas);
    };

    Kinetic.HitContext.prototype = {
        _fill: function(shape) {
            this.save();
            this.setAttr('fillStyle', shape.colorKey);
            shape._fillFuncHit(this);
            this.restore();
        },
        _stroke: function(shape) {
            if(shape.hasStroke()) {
                this._applyLineCap(shape);
                this.setAttr('lineWidth', shape.strokeWidth());
                this.setAttr('strokeStyle', shape.colorKey);
                shape._strokeFuncHit(this);
            }
        }
    };
    Kinetic.Util.extend(Kinetic.HitContext, Kinetic.Context);
})();
;/*jshint unused:false */
(function() {
    // CONSTANTS
    var GET = 'get',
        RGB = 'RGB',
        SET = 'set';

    Kinetic.Factory = {
        addGetterSetter: function(constructor, attr, def, validator, after) {
            this.addGetter(constructor, attr, def);
            this.addSetter(constructor, attr, validator, after);
            this.addOverloadedGetterSetter(constructor, attr);
        },
        addGetter: function(constructor, attr, def) {
            var method = GET + Kinetic.Util._capitalize(attr);

            constructor.prototype[method] = function() {
                var val = this.attrs[attr];
                return val === undefined ? def : val;
            };
        },
        addSetter: function(constructor, attr, validator, after) {
            var method = SET + Kinetic.Util._capitalize(attr);

            constructor.prototype[method] = function(val) {
                if (validator) {
                    val = validator.call(this, val);
                }

                this._setAttr(attr, val);

                if (after) {
                    after.call(this);
                }

                return this;
            };
        },
        addComponentsGetterSetter: function(constructor, attr, components, validator, after) {
            var len = components.length,
                capitalize = Kinetic.Util._capitalize,
                getter = GET + capitalize(attr),
                setter = SET + capitalize(attr),
                n, component;

            // getter
            constructor.prototype[getter] = function() {
                var ret = {};

                for (n=0; n<len; n++) {
                    component = components[n];
                    ret[component] = this.getAttr(attr + capitalize(component));
                }

                return ret;
            };

            // setter
            constructor.prototype[setter] = function(val) {
                var oldVal = this.attrs[attr],
                    key;

                if (validator) {
                    val = validator.call(this, val);
                }

                for (key in val) {
                    this._setAttr(attr + capitalize(key), val[key]);
                }

                this._fireChangeEvent(attr, oldVal, val);

                if (after) {
                    after.call(this);
                }

                return this;
            };

            this.addOverloadedGetterSetter(constructor, attr);
        },
        addOverloadedGetterSetter: function(constructor, attr) {
            var capitalizedAttr = Kinetic.Util._capitalize(attr),
                setter = SET + capitalizedAttr,
                getter = GET + capitalizedAttr;

            constructor.prototype[attr] = function() {
                // setting
                if (arguments.length) {
                    this[setter](arguments[0]);
                    return this;
                }
                // getting
                else {
                    return this[getter]();
                }
            };
        },
        backCompat: function(constructor, methods) {
            var key;

            for (key in methods) {
                constructor.prototype[key] = constructor.prototype[methods[key]];
            }
        },
        afterSetFilter: function() {
            this._filterUpToDate = false;
        }
    };

    Kinetic.Validators = {
        /**
         * @return {number}
         */
        RGBComponent: function(val) {
            if (val > 255) {
                return 255;
            } else if (val < 0) {
                return 0;
            } else {
                return Math.round(val);
            }
        },
        alphaComponent: function(val) {
            if (val > 1) {
                return 1;
            }
            // chrome does not honor alpha values of 0
            else if (val < 0.0001) {
                return 0.0001;
            }
            else {
                return val;
            }
        }
    };
})();;(function() {
    // CONSTANTS
    var ABSOLUTE_OPACITY = 'absoluteOpacity',
        ABSOLUTE_TRANSFORM = 'absoluteTransform',
        CHANGE = 'Change',
        CHILDREN = 'children',
        DOT = '.',
        EMPTY_STRING = '',
        GET = 'get',
        ID = 'id',
        KINETIC = 'kinetic',
        LISTENING = 'listening',
        MOUSEENTER = 'mouseenter',
        MOUSELEAVE = 'mouseleave',
        NAME = 'name',
        SET = 'set',
        SHAPE = 'Shape',
        SPACE = ' ',
        STAGE = 'stage',
        TRANSFORM = 'transform',
        UPPER_STAGE = 'Stage',
        VISIBLE = 'visible',
        CLONE_BLACK_LIST = ['id'],

        TRANSFORM_CHANGE_STR = [
            'xChange.kinetic',
            'yChange.kinetic',
            'scaleXChange.kinetic',
            'scaleYChange.kinetic',
            'skewXChange.kinetic',
            'skewYChange.kinetic',
            'rotationChange.kinetic',
            'offsetXChange.kinetic',
            'offsetYChange.kinetic',
            'transformsEnabledChange.kinetic'
        ].join(SPACE);


    Kinetic.Util.addMethods(Kinetic.Node, {
        _init: function(config) {
            var that = this;
            this._id = Kinetic.idCounter++;
            this.eventListeners = {};
            this.attrs = {};
            this._cache = {};
            this._filterUpToDate = false;
            this.setAttrs(config);

            // event bindings for cache handling
            this.on(TRANSFORM_CHANGE_STR, function() {
                this._clearCache(TRANSFORM);
                that._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
            });
            this.on('visibleChange.kinetic', function() {
                that._clearSelfAndDescendantCache(VISIBLE);
            });
            this.on('listeningChange.kinetic', function() {
                that._clearSelfAndDescendantCache(LISTENING);
            });
            this.on('opacityChange.kinetic', function() {
                that._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
            });
        },
        _clearCache: function(attr){
            if (attr) {
                delete this._cache[attr];
            }
            else {
                this._cache = {};
            }
        },
        _getCache: function(attr, privateGetter){
            var cache = this._cache[attr];

            // if not cached, we need to set it using the private getter method.
            if (cache === undefined) {
                this._cache[attr] = privateGetter.call(this);
            }

            return this._cache[attr];
        },
        /*
         * when the logic for a cached result depends on ancestor propagation, use this
         * method to clear self and children cache
         */
        _clearSelfAndDescendantCache: function(attr) {
            this._clearCache(attr);

            if (this.children) {
                this.getChildren().each(function(node) {
                    node._clearSelfAndDescendantCache(attr);
                });
            }
        },
        /**
        * clear cached canvas
        * @method
        * @memberof Kinetic.Node.prototype
        * @returns {Kinetic.Node}
        * @example
        * node.clearCache();
        */
        clearCache: function() {
            delete this._cache.canvas;
            this._filterUpToDate = false;
            return this;
        },
        /**
        * cache node to improve drawing performance, apply filters, or create more accurate
        *  hit regions
        * @method
        * @memberof Kinetic.Node.prototype
        * @param {Object} config
        * @param {Number} [config.x]
        * @param {Number} [config.y]
        * @param {Number} [config.width]
        * @param {Number} [config.height]
        * @param {Boolean} [config.drawBorder] when set to true, a red border will be drawn around the cached
        *  region for debugging purposes
        * @returns {Kinetic.Node}
        * @example
        * // cache a shape with the x,y position of the bounding box at the center and
        * // the width and height of the bounding box equal to the width and height of
        * // the shape obtained from shape.width() and shape.height()
        * image.cache();
        *
        * // cache a node and define the bounding box position and size
        * node.cache({
        *   x: -30,
        *   y: -30,
        *   width: 100,
        *   height: 200
        * });
        *
        * // cache a node and draw a red border around the bounding box
        * // for debugging purposes
        * node.cache({
        *   x: -30,
        *   y: -30,
        *   width: 100,
        *   height: 200,
        *   drawBorder: true
        * });
        */
        cache: function(config) {
            var conf = config || {},
                x = conf.x || 0,
                y = conf.y || 0,
                width = conf.width || this.width(),
                height = conf.height || this.height(),
                drawBorder = conf.drawBorder || false;

            if (width === 0 || height === 0) {
                Kinetic.Util.warn('Width or height of caching configuration equals 0. Cache is ignored.');
                return;
            }
            var cachedSceneCanvas = new Kinetic.SceneCanvas({
                    pixelRatio: 1,
                    width: width,
                    height: height
                }),
                cachedFilterCanvas = new Kinetic.SceneCanvas({
                    pixelRatio: 1,
                    width: width,
                    height: height
                }),
                cachedHitCanvas = new Kinetic.HitCanvas({
                    width: width,
                    height: height
                }),
                sceneContext = cachedSceneCanvas.getContext(),
                hitContext = cachedHitCanvas.getContext();

            cachedHitCanvas.isCache = true;

            this.clearCache();

            sceneContext.save();
            hitContext.save();

            // this will draw a red border around the cached box for
            // debugging purposes
            if (drawBorder) {
                sceneContext.save();
                sceneContext.beginPath();
                sceneContext.rect(0, 0, width, height);
                sceneContext.closePath();
                sceneContext.setAttr('strokeStyle', 'red');
                sceneContext.setAttr('lineWidth', 5);
                sceneContext.stroke();
                sceneContext.restore();
            }

            sceneContext.translate(x * -1, y * -1);
            hitContext.translate(x * -1, y * -1);

            // don't need to translate canvas if shape is not added to layer
            if (this.nodeType === 'Shape') {
                sceneContext.translate(this.x() * -1, this.y() * -1);
                hitContext.translate(this.x() * -1, this.y() * -1);
            }

            this.drawScene(cachedSceneCanvas, this);
            this.drawHit(cachedHitCanvas, this);

            sceneContext.restore();
            hitContext.restore();

            this._cache.canvas = {
                scene: cachedSceneCanvas,
                filter: cachedFilterCanvas,
                hit: cachedHitCanvas
            };

            return this;
        },
        _drawCachedSceneCanvas: function(context) {
            context.save();
            this.getLayer()._applyTransform(this, context);
            context._applyOpacity(this);
            context.drawImage(this._getCachedSceneCanvas()._canvas, 0, 0);
            context.restore();
        },
        _getCachedSceneCanvas: function() {
            var filters = this.filters(),
                cachedCanvas = this._cache.canvas,
                sceneCanvas = cachedCanvas.scene,
                filterCanvas = cachedCanvas.filter,
                filterContext = filterCanvas.getContext(),
                len, imageData, n, filter;

            if (filters) {
                if (!this._filterUpToDate) {
                    try {
                        len = filters.length;
                        filterContext.clear();
                        // copy cached canvas onto filter context
                        filterContext.drawImage(sceneCanvas._canvas, 0, 0);
                        imageData = filterContext.getImageData(0, 0, filterCanvas.getWidth(), filterCanvas.getHeight());

                        // apply filters to filter context
                        for (n=0; n<len; n++) {
                            filter = filters[n];
                            filter.call(this, imageData);
                            filterContext.putImageData(imageData, 0, 0);
                        }
                    }
                    catch(e) {
                        Kinetic.Util.warn('Unable to apply filter. ' + e.message);
                    }

                    this._filterUpToDate = true;
                }

                return filterCanvas;
            }
            else {
                return sceneCanvas;
            }
        },
        _drawCachedHitCanvas: function(context) {
            var cachedCanvas = this._cache.canvas,
                hitCanvas = cachedCanvas.hit;

            context.save();
            this.getLayer()._applyTransform(this, context);
            context.drawImage(hitCanvas._canvas, 0, 0);
            context.restore();
        },
        /**
         * bind events to the node. KineticJS supports mouseover, mousemove,
         *  mouseout, mouseenter, mouseleave, mousedown, mouseup, mousewheel, click, dblclick, touchstart, touchmove,
         *  touchend, tap, dbltap, dragstart, dragmove, and dragend events. The Kinetic Stage supports
         *  contentMouseover, contentMousemove, contentMouseout, contentMousedown, contentMouseup,
         *  contentClick, contentDblclick, contentTouchstart, contentTouchmove, contentTouchend, contentTap,
         *  and contentDblTap.  Pass in a string of events delimmited by a space to bind multiple events at once
         *  such as 'mousedown mouseup mousemove'. Include a namespace to bind an
         *  event by name such as 'click.foobar'.
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {String} evtStr e.g. 'click', 'mousedown touchstart', 'mousedown.foo touchstart.foo'
         * @param {Function} handler The handler function is passed an event object
         * @returns {Kinetic.Node}
         * @example
         * // add click listener
         * node.on('click', function() {
         *   console.log('you clicked me!');
         * });
         *
         * // get the target node
         * node.on('click', function(evt) {
         *   console.log(evt.target);
         * });
         *
         * // stop event propagation
         * node.on('click', function(evt) {
         *   evt.cancelBubble = true;
         * });
         *
         * // bind multiple listeners
         * node.on('click touchstart', function() {
         *   console.log('you clicked/touched me!');
         * });
         *
         * // namespace listener
         * node.on('click.foo', function() {
         *   console.log('you clicked/touched me!');
         * });
         *
         * // get the event type
         * node.on('click tap', function(evt) {
         *   var eventType = evt.type;
         * });
         *
         * // get native event object
         * node.on('click tap', function(evt) {
         *   var nativeEvent = evt.evt;
         * });
         *
         * // for change events, get the old and new val
         * node.on('xChange', function(evt) {
         *   var oldVal = evt.oldVal;
         *   var newVal = evt.newVal;
         * });
         */
        on: function(evtStr, handler) {
            var events = evtStr.split(SPACE),
                len = events.length,
                n, event, parts, baseEvent, name;

             /*
             * loop through types and attach event listeners to
             * each one.  eg. 'click mouseover.namespace mouseout'
             * will create three event bindings
             */
            for(n = 0; n < len; n++) {
                event = events[n];
                parts = event.split(DOT);
                baseEvent = parts[0];
                name = parts[1] || EMPTY_STRING;

                // create events array if it doesn't exist
                if(!this.eventListeners[baseEvent]) {
                    this.eventListeners[baseEvent] = [];
                }

                this.eventListeners[baseEvent].push({
                    name: name,
                    handler: handler
                });

                // NOTE: this flag is set to true when any event handler is added, even non
                // mouse or touch gesture events.  This improves performance for most
                // cases where users aren't using events, but is still very light weight.
                // To ensure perfect accuracy, devs can explicitly set listening to false.
                /*
                if (name !== KINETIC) {
                    this._listeningEnabled = true;
                    this._clearSelfAndAncestorCache(LISTENING_ENABLED);
                }
                */
            }

            return this;
        },
        /**
         * remove event bindings from the node. Pass in a string of
         *  event types delimmited by a space to remove multiple event
         *  bindings at once such as 'mousedown mouseup mousemove'.
         *  include a namespace to remove an event binding by name
         *  such as 'click.foobar'. If you only give a name like '.foobar',
         *  all events in that namespace will be removed.
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {String} evtStr e.g. 'click', 'mousedown touchstart', '.foobar'
         * @returns {Kinetic.Node}
         * @example
         * // remove listener
         * node.off('click');
         *
         * // remove multiple listeners
         * node.off('click touchstart');
         *
         * // remove listener by name
         * node.off('click.foo');
         */
        off: function(evtStr) {
            var events = (evtStr || '').split(SPACE),
                len = events.length,
                n, t, event, parts, baseEvent, name;

            if (!evtStr) {
                // remove all events
                for(t in this.eventListeners) {
                    this._off(t);
                }
            }
            for(n = 0; n < len; n++) {
                event = events[n];
                parts = event.split(DOT);
                baseEvent = parts[0];
                name = parts[1];

                if(baseEvent) {
                    if(this.eventListeners[baseEvent]) {
                        this._off(baseEvent, name);
                    }
                }
                else {
                    for(t in this.eventListeners) {
                        this._off(t, name);
                    }
                }
            }
            return this;
        },
        // some event aliases for third party integration like HammerJS
        dispatchEvent: function(evt) {
            var e = {
              target: this,
              type: evt.type,
              evt: evt
            };
            this.fire(evt.type, e);
        },
        addEventListener: function(type, handler) {
            // we have to pass native event to handler
            this.on(type, function(evt){
                handler.call(this, evt.evt);
            });
        },
        removeEventListener : function(type) {
            this.off(type);
        },
        /**
         * remove self from parent, but don't destroy
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Kinetic.Node}
         * @example
         * node.remove();
         */
        remove: function() {
            var parent = this.getParent();

            if(parent && parent.children) {
                parent.children.splice(this.index, 1);
                parent._setChildrenIndices();
                delete this.parent;
            }

            // every cached attr that is calculated via node tree
            // traversal must be cleared when removing a node
            this._clearSelfAndDescendantCache(STAGE);
            this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
            this._clearSelfAndDescendantCache(VISIBLE);
            this._clearSelfAndDescendantCache(LISTENING);
            this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);

            return this;
        },
        /**
         * remove and destroy self
         * @method
         * @memberof Kinetic.Node.prototype
         * @example
         * node.destroy();
         */
        destroy: function() {
            // remove from ids and names hashes
            Kinetic._removeId(this.getId());
            Kinetic._removeName(this.getName(), this._id);

            this.remove();
        },
        /**
         * get attr
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {String} attr
         * @returns {Integer|String|Object|Array}
         * @example
         * var x = node.getAttr('x');
         */
        getAttr: function(attr) {
            var method = GET + Kinetic.Util._capitalize(attr);
            if(Kinetic.Util._isFunction(this[method])) {
                return this[method]();
            }
            // otherwise get directly
            else {
                return this.attrs[attr];
            }
        },
        /**
        * get ancestors
        * @method
        * @memberof Kinetic.Node.prototype
        * @returns {Kinetic.Collection}
        * @example
        * shape.getAncestors().each(function(node) {
        *   console.log(node.getId());
        * })
        */
        getAncestors: function() {
            var parent = this.getParent(),
                ancestors = new Kinetic.Collection();

            while (parent) {
                ancestors.push(parent);
                parent = parent.getParent();
            }

            return ancestors;
        },
        /**
         * get attrs object literal
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Object}
         */
        getAttrs: function() {
            return this.attrs || {};
        },
        /**
         * set multiple attrs at once using an object literal
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Object} config object containing key value pairs
         * @returns {Kinetic.Node}
         * @example
         * node.setAttrs({
         *   x: 5,
         *   fill: 'red'
         * });
         */
        setAttrs: function(config) {
            var key, method;

            if(config) {
                for(key in config) {
                    if (key === CHILDREN) {

                    }
                    else {
                        method = SET + Kinetic.Util._capitalize(key);
                        // use setter if available
                        if(Kinetic.Util._isFunction(this[method])) {
                            this[method](config[key]);
                        }
                        // otherwise set directly
                        else {
                            this._setAttr(key, config[key]);
                        }
                    }
                }
            }
            return this;
        },
        /**
         * determine if node is listening for events by taking into account ancestors.
         *
         * Parent    | Self      | isListening
         * listening | listening |
         * ----------+-----------+------------
         * T         | T         | T
         * T         | F         | F
         * F         | T         | T
         * F         | F         | F
         * ----------+-----------+------------
         * T         | I         | T
         * F         | I         | F
         * I         | I         | T
         *
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Boolean}
         */
        isListening: function() {
            return this._getCache(LISTENING, this._isListening);
        },
        _isListening: function() {
            var listening = this.getListening(),
                parent = this.getParent();

            // the following conditions are a simplification of the truth table above.
            // please modify carefully
            if (listening === 'inherit') {
                if (parent) {
                    return parent.isListening();
                }
                else {
                    return true;
                }
            }
            else {
                return listening;
            }
        },
        /**
         * determine if node is visible by taking into account ancestors.
         *
         * Parent    | Self      | isVisible
         * visible   | visible   |
         * ----------+-----------+------------
         * T         | T         | T
         * T         | F         | F
         * F         | T         | T
         * F         | F         | F
         * ----------+-----------+------------
         * T         | I         | T
         * F         | I         | F
         * I         | I         | T

         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Boolean}
         */
        isVisible: function() {
            return this._getCache(VISIBLE, this._isVisible);
        },
        _isVisible: function() {
            var visible = this.getVisible(),
                parent = this.getParent();

            // the following conditions are a simplification of the truth table above.
            // please modify carefully
            if (visible === 'inherit') {
                if (parent) {
                    return parent.isVisible();
                }
                else {
                    return true;
                }
            }
            else {
                return visible;
            }
        },
        /**
         * determine if listening is enabled by taking into account descendants.  If self or any children
         * have _isListeningEnabled set to true, then self also has listening enabled.
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Boolean}
         */
        shouldDrawHit: function(canvas) {
            var layer = this.getLayer();
            return  (canvas && canvas.isCache) || (layer && layer.hitGraphEnabled())
                && this.isListening() && this.isVisible() && !Kinetic.isDragging();
        },
        /**
         * show node
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Kinetic.Node}
         */
        show: function() {
            this.setVisible(true);
            return this;
        },
        /**
         * hide node.  Hidden nodes are no longer detectable
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Kinetic.Node}
         */
        hide: function() {
            this.setVisible(false);
            return this;
        },
        /**
         * get zIndex relative to the node's siblings who share the same parent
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Integer}
         */
        getZIndex: function() {
            return this.index || 0;
        },
        /**
         * get absolute z-index which takes into account sibling
         *  and ancestor indices
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Integer}
         */
        getAbsoluteZIndex: function() {
            var depth = this.getDepth(),
                that = this,
                index = 0,
                nodes, len, n, child;

            function addChildren(children) {
                nodes = [];
                len = children.length;
                for(n = 0; n < len; n++) {
                    child = children[n];
                    index++;

                    if(child.nodeType !== SHAPE) {
                        nodes = nodes.concat(child.getChildren().toArray());
                    }

                    if(child._id === that._id) {
                        n = len;
                    }
                }

                if(nodes.length > 0 && nodes[0].getDepth() <= depth) {
                    addChildren(nodes);
                }
            }
            if(that.nodeType !== UPPER_STAGE) {
                addChildren(that.getStage().getChildren());
            }

            return index;
        },
        /**
         * get node depth in node tree.  Returns an integer.
         *  e.g. Stage depth will always be 0.  Layers will always be 1.  Groups and Shapes will always
         *  be >= 2
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Integer}
         */
        getDepth: function() {
            var depth = 0,
                parent = this.parent;

            while(parent) {
                depth++;
                parent = parent.parent;
            }
            return depth;
        },
        setPosition: function(pos) {
            this.setX(pos.x);
            this.setY(pos.y);
            return this;
        },
        getPosition: function() {
            return {
                x: this.getX(),
                y: this.getY()
            };
        },
        /**
         * get absolute position relative to the top left corner of the stage container div
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Object}
         */
        getAbsolutePosition: function() {
            var absoluteMatrix = this.getAbsoluteTransform().getMatrix(),
                absoluteTransform = new Kinetic.Transform(),
                offset = this.offset();

            // clone the matrix array
            absoluteTransform.m = absoluteMatrix.slice();
            absoluteTransform.translate(offset.x, offset.y);

            return absoluteTransform.getTranslation();
        },
        /**
         * set absolute position
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Object} pos
         * @param {Number} pos.x
         * @param {Number} pos.y
         * @returns {Kinetic.Node}
         */
        setAbsolutePosition: function(pos) {
            var origTrans = this._clearTransform(),
                it;

            // don't clear translation
            this.attrs.x = origTrans.x;
            this.attrs.y = origTrans.y;
            delete origTrans.x;
            delete origTrans.y;

            // unravel transform
            it = this.getAbsoluteTransform();

            it.invert();
            it.translate(pos.x, pos.y);
            pos = {
                x: this.attrs.x + it.getTranslation().x,
                y: this.attrs.y + it.getTranslation().y
            };

            this.setPosition({x:pos.x, y:pos.y});
            this._setTransform(origTrans);

            return this;
        },
        _setTransform: function(trans) {
            var key;

            for(key in trans) {
                this.attrs[key] = trans[key];
            }

            this._clearCache(TRANSFORM);
            this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
        },
        _clearTransform: function() {
            var trans = {
                x: this.getX(),
                y: this.getY(),
                rotation: this.getRotation(),
                scaleX: this.getScaleX(),
                scaleY: this.getScaleY(),
                offsetX: this.getOffsetX(),
                offsetY: this.getOffsetY(),
                skewX: this.getSkewX(),
                skewY: this.getSkewY()
            };

            this.attrs.x = 0;
            this.attrs.y = 0;
            this.attrs.rotation = 0;
            this.attrs.scaleX = 1;
            this.attrs.scaleY = 1;
            this.attrs.offsetX = 0;
            this.attrs.offsetY = 0;
            this.attrs.skewX = 0;
            this.attrs.skewY = 0;

            this._clearCache(TRANSFORM);
            this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);

            // return original transform
            return trans;
        },
        /**
         * move node by an amount relative to its current position
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Object} change
         * @param {Number} change.x
         * @param {Number} change.y
         * @returns {Kinetic.Node}
         * @example
         * // move node in x direction by 1px and y direction by 2px
         * node.move({
         *   x: 1,
         *   y: 2)
         * });
         */
        move: function(change) {
            var changeX = change.x,
                changeY = change.y,
                x = this.getX(),
                y = this.getY();

            if(changeX !== undefined) {
                x += changeX;
            }

            if(changeY !== undefined) {
                y += changeY;
            }

            this.setPosition({x:x, y:y});
            return this;
        },
        _eachAncestorReverse: function(func, top) {
            var family = [],
                parent = this.getParent(),
                len, n;

            // if top node is defined, and this node is top node,
            // there's no need to build a family tree.  just execute
            // func with this because it will be the only node
            if (top && top._id === this._id) {
                func(this);
                return true;
            }

            family.unshift(this);

            while(parent && (!top || parent._id !== top._id)) {
                family.unshift(parent);
                parent = parent.parent;
            }

            len = family.length;
            for(n = 0; n < len; n++) {
                func(family[n]);
            }
        },
        /**
         * rotate node by an amount in degrees relative to its current rotation
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Number} theta
         * @returns {Kinetic.Node}
         */
        rotate: function(theta) {
            this.setRotation(this.getRotation() + theta);
            return this;
        },
        /**
         * move node to the top of its siblings
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Boolean}
         */
        moveToTop: function() {
            if (!this.parent) {
                Kinetic.Util.warn('Node has no parent. moveToTop function is ignored.');
                return;
            }
            var index = this.index;
            this.parent.children.splice(index, 1);
            this.parent.children.push(this);
            this.parent._setChildrenIndices();
            return true;
        },
        /**
         * move node up
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Boolean}
         */
        moveUp: function() {
            if (!this.parent) {
                Kinetic.Util.warn('Node has no parent. moveUp function is ignored.');
                return;
            }
            var index = this.index,
                len = this.parent.getChildren().length;
            if(index < len - 1) {
                this.parent.children.splice(index, 1);
                this.parent.children.splice(index + 1, 0, this);
                this.parent._setChildrenIndices();
                return true;
            }
            return false;
        },
        /**
         * move node down
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Boolean}
         */
        moveDown: function() {
            if (!this.parent) {
                Kinetic.Util.warn('Node has no parent. moveDown function is ignored.');
                return;
            }
            var index = this.index;
            if(index > 0) {
                this.parent.children.splice(index, 1);
                this.parent.children.splice(index - 1, 0, this);
                this.parent._setChildrenIndices();
                return true;
            }
            return false;
        },
        /**
         * move node to the bottom of its siblings
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Boolean}
         */
        moveToBottom: function() {
            if (!this.parent) {
                Kinetic.Util.warn('Node has no parent. moveToBottom function is ignored.');
                return;
            }
            var index = this.index;
            if(index > 0) {
                this.parent.children.splice(index, 1);
                this.parent.children.unshift(this);
                this.parent._setChildrenIndices();
                return true;
            }
            return false;
        },
        /**
         * set zIndex relative to siblings
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Integer} zIndex
         * @returns {Kinetic.Node}
         */
        setZIndex: function(zIndex) {
            if (!this.parent) {
                Kinetic.Util.warn('Node has no parent. zIndex parameter is ignored.');
                return;
            }
            var index = this.index;
            this.parent.children.splice(index, 1);
            this.parent.children.splice(zIndex, 0, this);
            this.parent._setChildrenIndices();
            return this;
        },
        /**
         * get absolute opacity
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Number}
         */
        getAbsoluteOpacity: function() {
            return this._getCache(ABSOLUTE_OPACITY, this._getAbsoluteOpacity);
        },
        _getAbsoluteOpacity: function() {
            var absOpacity = this.getOpacity();
            if(this.getParent()) {
                absOpacity *= this.getParent().getAbsoluteOpacity();
            }
            return absOpacity;
        },
        /**
         * move node to another container
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Container} newContainer
         * @returns {Kinetic.Node}
         * @example
         * // move node from current layer into layer2
         * node.moveTo(layer2);
         */
        moveTo: function(newContainer) {
            // do nothing if new container is already parent
            if (this.getParent() !== newContainer) {
                this.remove();
                newContainer.add(this);
            }
            return this;
        },
        /**
         * convert Node into an object for serialization.  Returns an object.
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Object}
         */
        toObject: function() {
            var type = Kinetic.Util,
                obj = {},
                attrs = this.getAttrs(),
                key, val, getter, defaultValue;

            obj.attrs = {};

            // serialize only attributes that are not function, image, DOM, or objects with methods
            for(key in attrs) {
                val = attrs[key];
                if (!type._isFunction(val) && !type._isElement(val) && !(type._isObject(val) && type._hasMethods(val))) {
                    getter = this[key];
                    // remove attr value so that we can extract the default value from the getter
                    delete attrs[key];
                    defaultValue = getter ? getter.call(this) : null;
                    // restore attr value
                    attrs[key] = val;
                    if (defaultValue !== val) {
                        obj.attrs[key] = val;
                    }
                }
            }

            obj.className = this.getClassName();
            return obj;
        },
        /**
         * convert Node into a JSON string.  Returns a JSON string.
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {String}}
         */
        toJSON: function() {
            return JSON.stringify(this.toObject());
        },
        /**
         * get parent container
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Kinetic.Node}
         */
        getParent: function() {
            return this.parent;
        },
        /**
         * get layer ancestor
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Kinetic.Layer}
         */
        getLayer: function() {
            var parent = this.getParent();
            return parent ? parent.getLayer() : null;
        },
        /**
         * get stage ancestor
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Kinetic.Stage}
         */
        getStage: function() {
            return this._getCache(STAGE, this._getStage);
        },
        _getStage: function() {
            var parent = this.getParent();
            if(parent) {
                return parent.getStage();
            }
            else {
                return undefined;
            }
        },
        /**
         * fire event
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {String} eventType event type.  can be a regular event, like click, mouseover, or mouseout, or it can be a custom event, like myCustomEvent
         * @param {Event} [evt] event object
         * @param {Boolean} [bubble] setting the value to false, or leaving it undefined, will result in the event
         *  not bubbling.  Setting the value to true will result in the event bubbling.
         * @returns {Kinetic.Node}
         * @example
         * // manually fire click event
         * node.fire('click');
         *
         * // fire custom event
         * node.fire('foo');
         *
         * // fire custom event with custom event object
         * node.fire('foo', {
         *   bar: 10
         * });
         *
         * // fire click event that bubbles
         * node.fire('click', null, true);
         */
        fire: function(eventType, evt, bubble) {
            // bubble
            if (bubble) {
                this._fireAndBubble(eventType, evt || {});
            }
            // no bubble
            else {
                this._fire(eventType, evt || {});
            }
            return this;
        },
        /**
         * get absolute transform of the node which takes into
         *  account its ancestor transforms
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Kinetic.Transform}
         */
        getAbsoluteTransform: function(top) {
            // if using an argument, we can't cache the result.
            if (top) {
                return this._getAbsoluteTransform(top);
            }
            // if no argument, we can cache the result
            else {
                return this._getCache(ABSOLUTE_TRANSFORM, this._getAbsoluteTransform);
            }
        },
        _getAbsoluteTransform: function(top) {
            var at = new Kinetic.Transform(),
                transformsEnabled, trans;

            // start with stage and traverse downwards to self
            this._eachAncestorReverse(function(node) {
                transformsEnabled = node.transformsEnabled();
                trans = node.getTransform();

                if (transformsEnabled === 'all') {
                    at.multiply(trans);
                }
                else if (transformsEnabled === 'position') {
                    at.translate(node.x(), node.y());
                }
            }, top);
            return at;
        },
        /**
         * get transform of the node
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Kinetic.Transform}
         */
        getTransform: function() {
            return this._getCache(TRANSFORM, this._getTransform);
        },
        _getTransform: function() {
            var m = new Kinetic.Transform(),
                x = this.getX(),
                y = this.getY(),
                rotation = Kinetic.getAngle(this.getRotation()),
                scaleX = this.getScaleX(),
                scaleY = this.getScaleY(),
                skewX = this.getSkewX(),
                skewY = this.getSkewY(),
                offsetX = this.getOffsetX(),
                offsetY = this.getOffsetY();

            if(x !== 0 || y !== 0) {
                m.translate(x, y);
            }
            if(rotation !== 0) {
                m.rotate(rotation);
            }
            if(skewX !== 0 || skewY !== 0) {
                m.skew(skewX, skewY);
            }
            if(scaleX !== 1 || scaleY !== 1) {
                m.scale(scaleX, scaleY);
            }
            if(offsetX !== 0 || offsetY !== 0) {
                m.translate(-1 * offsetX, -1 * offsetY);
            }

            return m;
        },
        /**
         * clone node.  Returns a new Node instance with identical attributes.  You can also override
         *  the node properties with an object literal, enabling you to use an existing node as a template
         *  for another node
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Object} obj override attrs
         * @returns {Kinetic.Node}
         * @example
         * // simple clone
         * var clone = node.clone();
         *
         * // clone a node and override the x position
         * var clone = rect.clone({
         *   x: 5
         * });
         */
        clone: function(obj) {
            // instantiate new node
            var className = this.getClassName(),
                attrs = Kinetic.Util.cloneObject(this.attrs),
                key, allListeners, len, n, listener;
            // filter black attrs
            for (var i in CLONE_BLACK_LIST) {
                var blockAttr = CLONE_BLACK_LIST[i];
                delete attrs[blockAttr];
            }
            // apply attr overrides
            for (key in obj) {
                attrs[key] = obj[key];
            }

            var node = new Kinetic[className](attrs);
            // copy over listeners
            for(key in this.eventListeners) {
                allListeners = this.eventListeners[key];
                len = allListeners.length;
                for(n = 0; n < len; n++) {
                    listener = allListeners[n];
                    /*
                     * don't include kinetic namespaced listeners because
                     *  these are generated by the constructors
                     */
                    if(listener.name.indexOf(KINETIC) < 0) {
                        // if listeners array doesn't exist, then create it
                        if(!node.eventListeners[key]) {
                            node.eventListeners[key] = [];
                        }
                        node.eventListeners[key].push(listener);
                    }
                }
            }
            return node;
        },
        /**
         * Creates a composite data URL. If MIME type is not
         * specified, then "image/png" will result. For "image/jpeg", specify a quality
         * level as quality (range 0.0 - 1.0)
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Object} config
         * @param {String} [config.mimeType] can be "image/png" or "image/jpeg".
         *  "image/png" is the default
         * @param {Number} [config.x] x position of canvas section
         * @param {Number} [config.y] y position of canvas section
         * @param {Number} [config.width] width of canvas section
         * @param {Number} [config.height] height of canvas section
         * @param {Number} [config.quality] jpeg quality.  If using an "image/jpeg" mimeType,
         *  you can specify the quality from 0 to 1, where 0 is very poor quality and 1
         *  is very high quality
         * @returns {String}
         */
        toDataURL: function(config) {
            config = config || {};

            var mimeType = config.mimeType || null,
                quality = config.quality || null,
                stage = this.getStage(),
                x = config.x || 0,
                y = config.y || 0,
                canvas = new Kinetic.SceneCanvas({
                    width: config.width || this.getWidth() || (stage ? stage.getWidth() : 0),
                    height: config.height || this.getHeight() || (stage ? stage.getHeight() : 0),
                    pixelRatio: 1
                }),
                context = canvas.getContext();

            context.save();

            if(x || y) {
                context.translate(-1 * x, -1 * y);
            }

            this.drawScene(canvas);
            context.restore();

            return canvas.toDataURL(mimeType, quality);
        },
        /**
         * converts node into an image.  Since the toImage
         *  method is asynchronous, a callback is required.  toImage is most commonly used
         *  to cache complex drawings as an image so that they don't have to constantly be redrawn
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Object} config
         * @param {Function} config.callback function executed when the composite has completed
         * @param {String} [config.mimeType] can be "image/png" or "image/jpeg".
         *  "image/png" is the default
         * @param {Number} [config.x] x position of canvas section
         * @param {Number} [config.y] y position of canvas section
         * @param {Number} [config.width] width of canvas section
         * @param {Number} [config.height] height of canvas section
         * @param {Number} [config.quality] jpeg quality.  If using an "image/jpeg" mimeType,
         *  you can specify the quality from 0 to 1, where 0 is very poor quality and 1
         *  is very high quality
         * @example
         * var image = node.toImage({
         *   callback: function(img) {
         *     // do stuff with img
         *   }
         * });
         */
        toImage: function(config) {
            Kinetic.Util._getImage(this.toDataURL(config), function(img) {
                config.callback(img);
            });
        },
        setSize: function(size) {
            this.setWidth(size.width);
            this.setHeight(size.height);
            return this;
        },
        getSize: function() {
            return {
                width: this.getWidth(),
                height: this.getHeight()
            };
        },
        getWidth: function() {
            return this.attrs.width || 0;
        },
        getHeight: function() {
            return this.attrs.height || 0;
        },
        /**
         * get class name, which may return Stage, Layer, Group, or shape class names like Rect, Circle, Text, etc.
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {String}
         */
        getClassName: function() {
            return this.className || this.nodeType;
        },
        /**
         * get the node type, which may return Stage, Layer, Group, or Node
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {String}
         */
        getType: function() {
            return this.nodeType;
        },
        getDragDistance: function() {
            // compare with undefined because we need to track 0 value
            if (this.attrs.dragDistance !== undefined) {
                return this.attrs.dragDistance;
            } else if (this.parent) {
                return this.parent.getDragDistance();
            } else {
                return Kinetic.dragDistance;
            }
        },
        _get: function(selector) {
            return this.className === selector || this.nodeType === selector ? [this] : [];
        },
        _off: function(type, name) {
            var evtListeners = this.eventListeners[type],
                i, evtName;

            for(i = 0; i < evtListeners.length; i++) {
                evtName = evtListeners[i].name;
                // the following two conditions must be true in order to remove a handler:
                // 1) the current event name cannot be kinetic unless the event name is kinetic
                //    this enables developers to force remove a kinetic specific listener for whatever reason
                // 2) an event name is not specified, or if one is specified, it matches the current event name
                if((evtName !== 'kinetic' || name === 'kinetic') && (!name || evtName === name)) {
                    evtListeners.splice(i, 1);
                    if(evtListeners.length === 0) {
                        delete this.eventListeners[type];
                        break;
                    }
                    i--;
                }
            }
        },
        _fireChangeEvent: function(attr, oldVal, newVal) {
            this._fire(attr + CHANGE, {
                oldVal: oldVal,
                newVal: newVal
            });
        },
        setId: function(id) {
            var oldId = this.getId();

            Kinetic._removeId(oldId);
            Kinetic._addId(this, id);
            this._setAttr(ID, id);
            return this;
        },
        setName: function(name) {
            var oldName = this.getName();

            Kinetic._removeName(oldName, this._id);
            Kinetic._addName(this, name);
            this._setAttr(NAME, name);
            return this;
        },
        /**
         * set attr
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {String} attr
         * @param {*} val
         * @returns {Kinetic.Node}
         * @example
         * node.setAttr('x', 5);
         */
        setAttr: function(attr, val) {
            var method = SET + Kinetic.Util._capitalize(attr),
                func = this[method];

            if(Kinetic.Util._isFunction(func)) {
                func.call(this, val);
            }
            // otherwise set directly
            else {
                this._setAttr(attr, val);
            }
            return this;
        },
        _setAttr: function(key, val) {
            var oldVal;
            if(val !== undefined) {
                oldVal = this.attrs[key];
                this.attrs[key] = val;
                this._fireChangeEvent(key, oldVal, val);
            }
        },
        _setComponentAttr: function(key, component, val) {
            var oldVal;
            if(val !== undefined) {
                oldVal = this.attrs[key];

                if (!oldVal) {
                    // set value to default value using getAttr
                    this.attrs[key] = this.getAttr(key);
                }

                this.attrs[key][component] = val;
                this._fireChangeEvent(key, oldVal, val);
            }
        },
        _fireAndBubble: function(eventType, evt, compareShape) {
            var okayToRun = true;

            if(evt && this.nodeType === SHAPE) {
                evt.target = this;
            }

            if(eventType === MOUSEENTER && compareShape && (this._id === compareShape._id || (this.isAncestorOf && this.isAncestorOf(compareShape)))) {
                okayToRun = false;
            }
            else if(eventType === MOUSELEAVE && compareShape && (this._id === compareShape._id || (this.isAncestorOf && this.isAncestorOf(compareShape)))) {
                okayToRun = false;
            }
            if(okayToRun) {
                this._fire(eventType, evt);

                // simulate event bubbling
                var stopBubble = (eventType === MOUSEENTER || eventType === MOUSELEAVE) && ((compareShape && compareShape.isAncestorOf && compareShape.isAncestorOf(this)) || !!(compareShape && compareShape.isAncestorOf));
                if(evt && !evt.cancelBubble && this.parent && this.parent.isListening() && (!stopBubble)) {
                    if(compareShape && compareShape.parent) {
                        this._fireAndBubble.call(this.parent, eventType, evt, compareShape.parent);
                    }
                    else {
                        this._fireAndBubble.call(this.parent, eventType, evt);
                    }
                }
            }
        },
        _fire: function(eventType, evt) {
            var events = this.eventListeners[eventType],
                i;

            evt.type = eventType;

            if (events) {
                for(i = 0; i < events.length; i++) {
                    events[i].handler.call(this, evt);
                }
            }
        },
        /**
         * draw both scene and hit graphs.  If the node being drawn is the stage, all of the layers will be cleared and redrawn
         * @method
         * @memberof Kinetic.Node.prototype
         * @returns {Kinetic.Node}
         */
        draw: function() {
            this.drawScene();
            this.drawHit();
            return this;
        }
    });

    /**
     * create node with JSON string.  De-serializtion does not generate custom
     *  shape drawing functions, images, or event handlers (this would make the
     *  serialized object huge).  If your app uses custom shapes, images, and
     *  event handlers (it probably does), then you need to select the appropriate
     *  shapes after loading the stage and set these properties via on(), setDrawFunc(),
     *  and setImage() methods
     * @method
     * @memberof Kinetic.Node
     * @param {String} json
     * @param {Element} [container] optional container dom element used only if you're
     *  creating a stage node
     */
    Kinetic.Node.create = function(json, container) {
        return this._createNode(JSON.parse(json), container);
    };
    Kinetic.Node._createNode = function(obj, container) {
        var className = Kinetic.Node.prototype.getClassName.call(obj),
            children = obj.children,
            no, len, n;

        // if container was passed in, add it to attrs
        if(container) {
            obj.attrs.container = container;
        }

        no = new Kinetic[className](obj.attrs);
        if(children) {
            len = children.length;
            for(n = 0; n < len; n++) {
                no.add(this._createNode(children[n]));
            }
        }

        return no;
    };


    // =========================== add getters setters ===========================

    Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node, 'position');
    /**
     * get/set node position relative to parent
     * @name position
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Object} pos
     * @param {Number} pos.x
     * @param {Number} pos.y
     * @returns {Object}
     * @example
     * // get position
     * var position = node.position();
     *
     * // set position
     * node.position({
     *   x: 5
     *   y: 10
     * });
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'x', 0);

    /**
     * get/set x position
     * @name x
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Number} x
     * @returns {Object}
     * @example
     * // get x
     * var x = node.x();
     *
     * // set x
     * node.x(5);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'y', 0);

    /**
     * get/set y position
     * @name y
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Number} y
     * @returns {Integer}
     * @example
     * // get y
     * var y = node.y();
     *
     * // set y
     * node.y(5);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'opacity', 1);

    /**
     * get/set opacity.  Opacity values range from 0 to 1.
     *  A node with an opacity of 0 is fully transparent, and a node
     *  with an opacity of 1 is fully opaque
     * @name opacity
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Object} opacity
     * @returns {Number}
     * @example
     * // get opacity
     * var opacity = node.opacity();
     *
     * // set opacity
     * node.opacity(0.5);
     */

    Kinetic.Factory.addGetter(Kinetic.Node, 'name');
    Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node, 'name');

    /**
     * get/set name
     * @name name
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {String} name
     * @returns {String}
     * @example
     * // get name
     * var name = node.name();
     *
     * // set name
     * node.name('foo');
     *
     * // also node may have multiple names (as css classes)
     * node.name('foo bar');
     */

    Kinetic.Factory.addGetter(Kinetic.Node, 'id');
    Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node, 'id');

    /**
     * get/set id
     * @name id
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {String} id
     * @returns {String}
     * @example
     * // get id
     * var name = node.id();
     *
     * // set id
     * node.id('foo');
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'rotation', 0);

    /**
     * get/set rotation in degrees
     * @name rotation
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Number} rotation
     * @returns {Number}
     * @example
     * // get rotation in degrees
     * var rotation = node.rotation();
     *
     * // set rotation in degrees
     * node.rotation(45);
     */

    Kinetic.Factory.addComponentsGetterSetter(Kinetic.Node, 'scale', ['x', 'y']);

    /**
     * get/set scale
     * @name scale
     * @param {Object} scale
     * @param {Number} scale.x
     * @param {Number} scale.y
     * @method
     * @memberof Kinetic.Node.prototype
     * @returns {Object}
     * @example
     * // get scale
     * var scale = node.scale();
     *
     * // set scale
     * shape.scale({
     *   x: 2
     *   y: 3
     * });
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'scaleX', 1);

    /**
     * get/set scale x
     * @name scaleX
     * @param {Number} x
     * @method
     * @memberof Kinetic.Node.prototype
     * @returns {Number}
     * @example
     * // get scale x
     * var scaleX = node.scaleX();
     *
     * // set scale x
     * node.scaleX(2);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'scaleY', 1);

    /**
     * get/set scale y
     * @name scaleY
     * @param {Number} y
     * @method
     * @memberof Kinetic.Node.prototype
     * @returns {Number}
     * @example
     * // get scale y
     * var scaleY = node.scaleY();
     *
     * // set scale y
     * node.scaleY(2);
     */

    Kinetic.Factory.addComponentsGetterSetter(Kinetic.Node, 'skew', ['x', 'y']);

    /**
     * get/set skew
     * @name skew
     * @param {Object} skew
     * @param {Number} skew.x
     * @param {Number} skew.y
     * @method
     * @memberof Kinetic.Node.prototype
     * @returns {Object}
     * @example
     * // get skew
     * var skew = node.skew();
     *
     * // set skew
     * node.skew({
     *   x: 20
     *   y: 10
     * });
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'skewX', 0);

    /**
     * get/set skew x
     * @name skewX
     * @param {Number} x
     * @method
     * @memberof Kinetic.Node.prototype
     * @returns {Number}
     * @example
     * // get skew x
     * var skewX = node.skewX();
     *
     * // set skew x
     * node.skewX(3);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'skewY', 0);

    /**
     * get/set skew y
     * @name skewY
     * @param {Number} y
     * @method
     * @memberof Kinetic.Node.prototype
     * @returns {Number}
     * @example
     * // get skew y
     * var skewY = node.skewY();
     *
     * // set skew y
     * node.skewY(3);
     */

    Kinetic.Factory.addComponentsGetterSetter(Kinetic.Node, 'offset', ['x', 'y']);

    /**
     * get/set offset.  Offsets the default position and rotation point
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Object} offset
     * @param {Number} offset.x
     * @param {Number} offset.y
     * @returns {Object}
     * @example
     * // get offset
     * var offset = node.offset();
     *
     * // set offset
     * node.offset({
     *   x: 20
     *   y: 10
     * });
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'offsetX', 0);

    /**
     * get/set offset x
     * @name offsetX
     * @memberof Kinetic.Node.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get offset x
     * var offsetX = node.offsetX();
     *
     * // set offset x
     * node.offsetX(3);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'offsetY', 0);

    /**
     * get/set drag distance
     * @name dragDistance
     * @memberof Kinetic.Node.prototype
     * @param {Number} distance
     * @returns {Number}
     * @example
     * // get drag distance
     * var dragDistance = node.dragDistance();
     *
     * // set distance
     * // node starts dragging only if pointer moved more then 3 pixels
     * node.dragDistance(3);
     * // or set globally
     * Kinetic.dragDistance = 3;
     */

    Kinetic.Factory.addSetter(Kinetic.Node, 'dragDistance');
    Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node, 'dragDistance');

    /**
     * get/set offset y
     * @name offsetY
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get offset y
     * var offsetY = node.offsetY();
     *
     * // set offset y
     * node.offsetY(3);
     */

    Kinetic.Factory.addSetter(Kinetic.Node, 'width', 0);
    Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node, 'width');
    /**
     * get/set width
     * @name width
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Number} width
     * @returns {Number}
     * @example
     * // get width
     * var width = node.width();
     *
     * // set width
     * node.width(100);
     */

    Kinetic.Factory.addSetter(Kinetic.Node, 'height', 0);
    Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node, 'height');
    /**
     * get/set height
     * @name height
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Number} height
     * @returns {Number}
     * @example
     * // get height
     * var height = node.height();
     *
     * // set height
     * node.height(100);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'listening', 'inherit');
    /**
     * get/set listenig attr.  If you need to determine if a node is listening or not
     *   by taking into account its parents, use the isListening() method
     * @name listening
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Boolean|String} listening Can be "inherit", true, or false.  The default is "inherit".
     * @returns {Boolean|String}
     * @example
     * // get listening attr
     * var listening = node.listening();
     *
     * // stop listening for events
     * node.listening(false);
     *
     * // listen for events
     * node.listening(true);
     *
     * // listen to events according to the parent
     * node.listening('inherit');
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'filters', undefined, function(val) {this._filterUpToDate = false;return val;});
    /**
     * get/set filters.  Filters are applied to cached canvases
     * @name filters
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Array} filters array of filters
     * @returns {Array}
     * @example
     * // get filters
     * var filters = node.filters();
     *
     * // set a single filter
     * node.cache();
     * node.filters([Kinetic.Filters.Blur]);
     *
     * // set multiple filters
     * node.cache();
     * node.filters([
     *   Kinetic.Filters.Blur,
     *   Kinetic.Filters.Sepia,
     *   Kinetic.Filters.Invert
     * ]);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'visible', 'inherit');
    /**
     * get/set visible attr.  Can be "inherit", true, or false.  The default is "inherit".
     *   If you need to determine if a node is visible or not
     *   by taking into account its parents, use the isVisible() method
     * @name visible
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Boolean|String} visible
     * @returns {Boolean|String}
     * @example
     * // get visible attr
     * var visible = node.visible();
     *
     * // make invisible
     * node.visible(false);
     *
     * // make visible
     * node.visible(true);
     *
     * // make visible according to the parent
     * node.visible('inherit');
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'transformsEnabled', 'all');

    /**
     * get/set transforms that are enabled.  Can be "all", "none", or "position".  The default
     *  is "all"
     * @name transformsEnabled
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {String} enabled
     * @returns {String}
     * @example
     * // enable position transform only to improve draw performance
     * node.transformsEnabled('position');
     *
     * // enable all transforms
     * node.transformsEnabled('all');
     */



    /**
     * get/set node size
     * @name size
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Object} size
     * @param {Number} size.width
     * @param {Number} size.height
     * @returns {Object}
     * @example
     * // get node size
     * var size = node.size();
     * var x = size.x;
     * var y = size.y;
     *
     * // set size
     * node.size({
     *   width: 100,
     *   height: 200
     * });
     */
    Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node, 'size');

    Kinetic.Factory.backCompat(Kinetic.Node, {
        rotateDeg: 'rotate',
        setRotationDeg: 'setRotation',
        getRotationDeg: 'getRotation'
    });

    Kinetic.Collection.mapMethods(Kinetic.Node);
})();
;(function() {
    /**
    * Grayscale Filter
    * @function
    * @memberof Kinetic.Filters
    * @param {Object} imageData
    * @example
    * node.cache();
    * node.filters([Kinetic.Filters.Grayscale]);
    */
    Kinetic.Filters.Grayscale = function(imageData) {
        var data = imageData.data,
            len = data.length,
            i, brightness;

        for(i = 0; i < len; i += 4) {
            brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
            // red
            data[i] = brightness;
            // green
            data[i + 1] = brightness;
            // blue
            data[i + 2] = brightness;
        }
    };
})();
;(function() {
    /**
     * Brighten Filter.
     * @function
     * @memberof Kinetic.Filters
     * @param {Object} imageData
     * @example
     * node.cache();
     * node.filters([Kinetic.Filters.Brighten]);
     * node.brightness(0.8);
     */
    Kinetic.Filters.Brighten = function(imageData) {
        var brightness = this.brightness() * 255,
            data = imageData.data,
            len = data.length,
            i;

        for(i = 0; i < len; i += 4) {
            // red
            data[i] += brightness;
            // green
            data[i + 1] += brightness;
            // blue
            data[i + 2] += brightness;
        }
    };

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'brightness', 0, null, Kinetic.Factory.afterSetFilter);
    /**
    * get/set filter brightness.  The brightness is a number between -1 and 1.&nbsp; Positive values
    *  brighten the pixels and negative values darken them. Use with {@link Kinetic.Filters.Brighten} filter.
    * @name brightness
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {Number} brightness value between -1 and 1
    * @returns {Number}
    */

})();
;(function() {
    /**
    * Invert Filter
    * @function
    * @memberof Kinetic.Filters
    * @param {Object} imageData
    * @example
    * node.cache();
    * node.filters([Kinetic.Filters.Invert]);
    */
    Kinetic.Filters.Invert = function(imageData) {
        var data = imageData.data,
            len = data.length,
            i;

        for(i = 0; i < len; i += 4) {
            // red
            data[i] = 255 - data[i];
            // green
            data[i + 1] = 255 - data[i + 1];
            // blue
            data[i + 2] = 255 - data[i + 2];
        }
    };
})();;/*
 the Gauss filter
 master repo: https://github.com/pavelpower/kineticjsGaussFilter/
*/
(function() {
    /*

     StackBlur - a fast almost Gaussian Blur For Canvas

     Version:   0.5
     Author:    Mario Klingemann
     Contact:   mario@quasimondo.com
     Website:   http://www.quasimondo.com/StackBlurForCanvas
     Twitter:   @quasimondo

     In case you find this class useful - especially in commercial projects -
     I am not totally unhappy for a small donation to my PayPal account
     mario@quasimondo.de

     Or support me on flattr:
     https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript

     Copyright (c) 2010 Mario Klingemann

     Permission is hereby granted, free of charge, to any person
     obtaining a copy of this software and associated documentation
     files (the "Software"), to deal in the Software without
     restriction, including without limitation the rights to use,
     copy, modify, merge, publish, distribute, sublicense, and/or sell
     copies of the Software, and to permit persons to whom the
     Software is furnished to do so, subject to the following
     conditions:

     The above copyright notice and this permission notice shall be
     included in all copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
     OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
     HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
     WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
     FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
     OTHER DEALINGS IN THE SOFTWARE.
     */

    function BlurStack() {
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 0;
        this.next = null;
    }

    var mul_table = [
        512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
        454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
        482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
        437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
        497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
        320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
        446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
        329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
        505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
        399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
        324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
        268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
        451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
        385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
        332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
        289,287,285,282,280,278,275,273,271,269,267,265,263,261,259
    ];

    var shg_table = [
        9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17,
        17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19,
        19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
        21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
        21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
        22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
        22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24
    ];

    function filterGaussBlurRGBA( imageData, radius) {

        var pixels = imageData.data,
            width = imageData.width,
            height = imageData.height;

        var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum,
            r_out_sum, g_out_sum, b_out_sum, a_out_sum,
            r_in_sum, g_in_sum, b_in_sum, a_in_sum,
            pr, pg, pb, pa, rbs;

        var div = radius + radius + 1,
            widthMinus1  = width - 1,
            heightMinus1 = height - 1,
            radiusPlus1  = radius + 1,
            sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2,
            stackStart = new BlurStack(),
            stackEnd = null,
            stack = stackStart,
            stackIn = null,
            stackOut = null,
            mul_sum = mul_table[radius],
            shg_sum = shg_table[radius];

        for ( i = 1; i < div; i++ ) {
            stack = stack.next = new BlurStack();
            if ( i == radiusPlus1 ){
                stackEnd = stack;
            }
        }

        stack.next = stackStart;

        yw = yi = 0;

        for ( y = 0; y < height; y++ )
        {
            r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;

            r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
            g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
            b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
            a_out_sum = radiusPlus1 * ( pa = pixels[yi+3] );

            r_sum += sumFactor * pr;
            g_sum += sumFactor * pg;
            b_sum += sumFactor * pb;
            a_sum += sumFactor * pa;

            stack = stackStart;

            for( i = 0; i < radiusPlus1; i++ )
            {
                stack.r = pr;
                stack.g = pg;
                stack.b = pb;
                stack.a = pa;
                stack = stack.next;
            }

            for( i = 1; i < radiusPlus1; i++ )
            {
                p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
                r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
                g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
                b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
                a_sum += ( stack.a = ( pa = pixels[p+3])) * rbs;

                r_in_sum += pr;
                g_in_sum += pg;
                b_in_sum += pb;
                a_in_sum += pa;

                stack = stack.next;
            }


            stackIn = stackStart;
            stackOut = stackEnd;
            for ( x = 0; x < width; x++ )
            {
                pixels[yi+3] = pa = (a_sum * mul_sum) >> shg_sum;
                if ( pa !== 0 )
                {
                    pa = 255 / pa;
                    pixels[yi]   = ((r_sum * mul_sum) >> shg_sum) * pa;
                    pixels[yi+1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                    pixels[yi+2] = ((b_sum * mul_sum) >> shg_sum) * pa;
                } else {
                    pixels[yi] = pixels[yi+1] = pixels[yi+2] = 0;
                }

                r_sum -= r_out_sum;
                g_sum -= g_out_sum;
                b_sum -= b_out_sum;
                a_sum -= a_out_sum;

                r_out_sum -= stackIn.r;
                g_out_sum -= stackIn.g;
                b_out_sum -= stackIn.b;
                a_out_sum -= stackIn.a;

                p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;

                r_in_sum += ( stackIn.r = pixels[p]);
                g_in_sum += ( stackIn.g = pixels[p+1]);
                b_in_sum += ( stackIn.b = pixels[p+2]);
                a_in_sum += ( stackIn.a = pixels[p+3]);

                r_sum += r_in_sum;
                g_sum += g_in_sum;
                b_sum += b_in_sum;
                a_sum += a_in_sum;

                stackIn = stackIn.next;

                r_out_sum += ( pr = stackOut.r );
                g_out_sum += ( pg = stackOut.g );
                b_out_sum += ( pb = stackOut.b );
                a_out_sum += ( pa = stackOut.a );

                r_in_sum -= pr;
                g_in_sum -= pg;
                b_in_sum -= pb;
                a_in_sum -= pa;

                stackOut = stackOut.next;

                yi += 4;
            }
            yw += width;
        }


        for ( x = 0; x < width; x++ )
        {
            g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;

            yi = x << 2;
            r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
            g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
            b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
            a_out_sum = radiusPlus1 * ( pa = pixels[yi+3]);

            r_sum += sumFactor * pr;
            g_sum += sumFactor * pg;
            b_sum += sumFactor * pb;
            a_sum += sumFactor * pa;

            stack = stackStart;

            for( i = 0; i < radiusPlus1; i++ )
            {
                stack.r = pr;
                stack.g = pg;
                stack.b = pb;
                stack.a = pa;
                stack = stack.next;
            }

            yp = width;

            for( i = 1; i <= radius; i++ )
            {
                yi = ( yp + x ) << 2;

                r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
                g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
                b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
                a_sum += ( stack.a = ( pa = pixels[yi+3])) * rbs;

                r_in_sum += pr;
                g_in_sum += pg;
                b_in_sum += pb;
                a_in_sum += pa;

                stack = stack.next;

                if( i < heightMinus1 )
                {
                    yp += width;
                }
            }

            yi = x;
            stackIn = stackStart;
            stackOut = stackEnd;
            for ( y = 0; y < height; y++ )
            {
                p = yi << 2;
                pixels[p+3] = pa = (a_sum * mul_sum) >> shg_sum;
                if ( pa > 0 )
                {
                    pa = 255 / pa;
                    pixels[p]   = ((r_sum * mul_sum) >> shg_sum ) * pa;
                    pixels[p+1] = ((g_sum * mul_sum) >> shg_sum ) * pa;
                    pixels[p+2] = ((b_sum * mul_sum) >> shg_sum ) * pa;
                } else {
                    pixels[p] = pixels[p+1] = pixels[p+2] = 0;
                }

                r_sum -= r_out_sum;
                g_sum -= g_out_sum;
                b_sum -= b_out_sum;
                a_sum -= a_out_sum;

                r_out_sum -= stackIn.r;
                g_out_sum -= stackIn.g;
                b_out_sum -= stackIn.b;
                a_out_sum -= stackIn.a;

                p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;

                r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
                g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
                b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
                a_sum += ( a_in_sum += ( stackIn.a = pixels[p+3]));

                stackIn = stackIn.next;

                r_out_sum += ( pr = stackOut.r );
                g_out_sum += ( pg = stackOut.g );
                b_out_sum += ( pb = stackOut.b );
                a_out_sum += ( pa = stackOut.a );

                r_in_sum -= pr;
                g_in_sum -= pg;
                b_in_sum -= pb;
                a_in_sum -= pa;

                stackOut = stackOut.next;

                yi += width;
            }
        }
    }

    /**
     * Blur Filter
     * @function
     * @name Blur
     * @memberof Kinetic.Filters
     * @param {Object} imageData
     * @example
     * node.cache();
     * node.filters([Kinetic.Filters.Blur]);
     * node.blurRadius(10);
     */
    Kinetic.Filters.Blur = function Blur(imageData) {
        var radius = Math.round(this.blurRadius());

        if (radius > 0) {
            filterGaussBlurRGBA(imageData, radius);
        }
    };

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'blurRadius', 0, null, Kinetic.Factory.afterSetFilter);

    /**
    * get/set blur radius. Use with {@link Kinetic.Filters.Blur} filter
    * @name blurRadius
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {Integer} radius
    * @returns {Integer}
    */
})();;(function() {

	function pixelAt(idata, x, y) {
		var idx = (y * idata.width + x) * 4;
		var d = [];
		d.push(idata.data[idx++], idata.data[idx++], idata.data[idx++], idata.data[idx++]);
		return d;
	}

	function rgbDistance(p1, p2) {
		return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2) + Math.pow(p1[2] - p2[2], 2));
	}

	function rgbMean(pTab) {
		var m = [0, 0, 0];

		for (var i = 0; i < pTab.length; i++) {
			m[0] += pTab[i][0];
			m[1] += pTab[i][1];
			m[2] += pTab[i][2];
		}

		m[0] /= pTab.length;
		m[1] /= pTab.length;
		m[2] /= pTab.length;

		return m;
	}

	function backgroundMask(idata, threshold) {
		var rgbv_no = pixelAt(idata, 0, 0);
		var rgbv_ne = pixelAt(idata, idata.width - 1, 0);
		var rgbv_so = pixelAt(idata, 0, idata.height - 1);
		var rgbv_se = pixelAt(idata, idata.width - 1, idata.height - 1);


		var thres = threshold || 10;
		if (rgbDistance(rgbv_no, rgbv_ne) < thres && rgbDistance(rgbv_ne, rgbv_se) < thres && rgbDistance(rgbv_se, rgbv_so) < thres && rgbDistance(rgbv_so, rgbv_no) < thres) {

			// Mean color
			var mean = rgbMean([rgbv_ne, rgbv_no, rgbv_se, rgbv_so]);

			// Mask based on color distance
			var mask = [];
			for (var i = 0; i < idata.width * idata.height; i++) {
				var d = rgbDistance(mean, [idata.data[i * 4], idata.data[i * 4 + 1], idata.data[i * 4 + 2]]);
				mask[i] = (d < thres) ? 0 : 255;
			}

			return mask;
		}
	}

	function applyMask(idata, mask) {
		for (var i = 0; i < idata.width * idata.height; i++) {
			idata.data[4 * i + 3] = mask[i];
		}
	}

	function erodeMask(mask, sw, sh) {

		var weights = [1, 1, 1, 1, 0, 1, 1, 1, 1];
		var side = Math.round(Math.sqrt(weights.length));
		var halfSide = Math.floor(side / 2);

		var maskResult = [];
		for (var y = 0; y < sh; y++) {
			for (var x = 0; x < sw; x++) {

				var so = y * sw + x;
				var a = 0;
				for (var cy = 0; cy < side; cy++) {
					for (var cx = 0; cx < side; cx++) {
						var scy = y + cy - halfSide;
						var scx = x + cx - halfSide;

						if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {

							var srcOff = scy * sw + scx;
							var wt = weights[cy * side + cx];

							a += mask[srcOff] * wt;
						}
					}
				}

				maskResult[so] = (a === 255 * 8) ? 255 : 0;
			}
		}

		return maskResult;
	}

	function dilateMask(mask, sw, sh) {

		var weights = [1, 1, 1, 1, 1, 1, 1, 1, 1];
		var side = Math.round(Math.sqrt(weights.length));
		var halfSide = Math.floor(side / 2);

		var maskResult = [];
		for (var y = 0; y < sh; y++) {
			for (var x = 0; x < sw; x++) {

				var so = y * sw + x;
				var a = 0;
				for (var cy = 0; cy < side; cy++) {
					for (var cx = 0; cx < side; cx++) {
						var scy = y + cy - halfSide;
						var scx = x + cx - halfSide;

						if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {

							var srcOff = scy * sw + scx;
							var wt = weights[cy * side + cx];

							a += mask[srcOff] * wt;
						}
					}
				}

				maskResult[so] = (a >= 255 * 4) ? 255 : 0;
			}
		}

		return maskResult;
	}

	function smoothEdgeMask(mask, sw, sh) {

		var weights = [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9];
		var side = Math.round(Math.sqrt(weights.length));
		var halfSide = Math.floor(side / 2);

		var maskResult = [];
		for (var y = 0; y < sh; y++) {
			for (var x = 0; x < sw; x++) {

				var so = y * sw + x;
				var a = 0;
				for (var cy = 0; cy < side; cy++) {
					for (var cx = 0; cx < side; cx++) {
						var scy = y + cy - halfSide;
						var scx = x + cx - halfSide;

						if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {

							var srcOff = scy * sw + scx;
							var wt = weights[cy * side + cx];

							a += mask[srcOff] * wt;
						}
					}
				}

				maskResult[so] = a;
			}
		}

		return maskResult;
	}

	/**
	 * Mask Filter
	 * @function
	 * @name Mask
	 * @memberof Kinetic.Filters
	 * @param {Object} imageData
	 * @example
     * node.cache();
     * node.filters([Kinetic.Filters.Mask]);
     * node.threshold(0.1);
	 */
	Kinetic.Filters.Mask = function(imageData) {
		// Detect pixels close to the background color
		var threshold = this.threshold(),
        mask = backgroundMask(imageData, threshold);
		if (mask) {
			// Erode
			mask = erodeMask(mask, imageData.width, imageData.height);

			// Dilate
			mask = dilateMask(mask, imageData.width, imageData.height);

			// Gradient
			mask = smoothEdgeMask(mask, imageData.width, imageData.height);

			// Apply mask
			applyMask(imageData, mask);

			// todo : Update hit region function according to mask
		}

		return imageData;
	};

	Kinetic.Factory.addGetterSetter(Kinetic.Node, 'threshold', 0, null, Kinetic.Factory.afterSetFilter);
})();
;(function () {
    /**
     * RGB Filter
     * @function
     * @name RGB
     * @memberof Kinetic.Filters
     * @param {Object} imageData
     * @author ippo615
     * @example
     * node.cache();
     * node.filters([Kinetic.Filters.RGB]);
     * node.blue(120);
     * node.green(200);
     */
    Kinetic.Filters.RGB = function (imageData) {
        var data = imageData.data,
            nPixels = data.length,
            red = this.red(),
            green = this.green(),
            blue = this.blue(),
            i, brightness;

        for (i = 0; i < nPixels; i += 4) {
            brightness = (0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2])/255;
            data[i    ] = brightness*red; // r
            data[i + 1] = brightness*green; // g
            data[i + 2] = brightness*blue; // b
            data[i + 3] = data[i + 3]; // alpha
        }
    };

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'red', 0, function(val) {
        this._filterUpToDate = false;
        if (val > 255) {
            return 255;
        }
        else if (val < 0) {
            return 0;
        }
        else {
            return Math.round(val);
        }
    });
    /**
    * get/set filter red value. Use with {@link Kinetic.Filters.RGB} filter.
    * @name red
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {Integer} red value between 0 and 255
    * @returns {Integer}
    */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'green', 0, function(val) {
        this._filterUpToDate = false;
        if (val > 255) {
            return 255;
        }
        else if (val < 0) {
            return 0;
        }
        else {
            return Math.round(val);
        }
    });
    /**
    * get/set filter green value. Use with {@link Kinetic.Filters.RGB} filter.
    * @name green
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {Integer} green value between 0 and 255
    * @returns {Integer}
    */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'blue', 0, Kinetic.Validators.RGBComponent, Kinetic.Factory.afterSetFilter);
    /**
    * get/set filter blue value. Use with {@link Kinetic.Filters.RGB} filter.
    * @name blue
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {Integer} blue value between 0 and 255
    * @returns {Integer}
    */
})();
;(function () {

    /**
    * HSV Filter. Adjusts the hue, saturation and value
    * @function
    * @name HSV
    * @memberof Kinetic.Filters
    * @param {Object} imageData
    * @author ippo615
    * @example
    * image.filters([Kinetic.Filters.HSV]);
    * image.value(200);
    */

    Kinetic.Filters.HSV = function (imageData) {
        var data = imageData.data,
            nPixels = data.length,
            v = Math.pow(2,this.value()),
            s = Math.pow(2,this.saturation()),
            h = Math.abs((this.hue()) + 360) % 360,
            i;

        // Basis for the technique used:
        // http://beesbuzz.biz/code/hsv_color_transforms.php
        // V is the value multiplier (1 for none, 2 for double, 0.5 for half)
        // S is the saturation multiplier (1 for none, 2 for double, 0.5 for half)
        // H is the hue shift in degrees (0 to 360)
        // vsu = V*S*cos(H*PI/180);
        // vsw = V*S*sin(H*PI/180);
        //[ .299V+.701vsu+.168vsw    .587V-.587vsu+.330vsw    .114V-.114vsu-.497vsw ] [R]
        //[ .299V-.299vsu-.328vsw    .587V+.413vsu+.035vsw    .114V-.114vsu+.292vsw ]*[G]
        //[ .299V-.300vsu+1.25vsw    .587V-.588vsu-1.05vsw    .114V+.886vsu-.203vsw ] [B]

        // Precompute the values in the matrix:
        var vsu = v*s*Math.cos(h*Math.PI/180),
            vsw = v*s*Math.sin(h*Math.PI/180);
        // (result spot)(source spot)
        var rr = 0.299*v+0.701*vsu+0.167*vsw,
            rg = 0.587*v-0.587*vsu+0.330*vsw,
            rb = 0.114*v-0.114*vsu-0.497*vsw;
        var gr = 0.299*v-0.299*vsu-0.328*vsw,
            gg = 0.587*v+0.413*vsu+0.035*vsw,
            gb = 0.114*v-0.114*vsu+0.293*vsw;
        var br = 0.299*v-0.300*vsu+1.250*vsw,
            bg = 0.587*v-0.586*vsu-1.050*vsw,
            bb = 0.114*v+0.886*vsu-0.200*vsw;

        var r,g,b,a;

        for (i = 0; i < nPixels; i += 4) {
            r = data[i+0];
            g = data[i+1];
            b = data[i+2];
            a = data[i+3];

            data[i+0] = rr*r + rg*g + rb*b;
            data[i+1] = gr*r + gg*g + gb*b;
            data[i+2] = br*r + bg*g + bb*b;
            data[i+3] = a; // alpha
        }

    };

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'hue', 0, null, Kinetic.Factory.afterSetFilter);
    /**
    * get/set hsv hue in degrees. Use with {@link Kinetic.Filters.HSV} or {@link Kinetic.Filters.HSL} filter.
    * @name hue
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {Number} hue value between 0 and 359
    * @returns {Number}
    */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'saturation', 0, null, Kinetic.Factory.afterSetFilter);
    /**
    * get/set hsv saturation. Use with {@link Kinetic.Filters.HSV} or {@link Kinetic.Filters.HSL} filter.
    * @name saturation
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {Number} saturation 0 is no change, -1.0 halves the saturation, 1.0 doubles, etc..
    * @returns {Number}
    */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'value', 0, null, Kinetic.Factory.afterSetFilter);
    /**
    * get/set hsv value. Use with {@link Kinetic.Filters.HSV} filter.
    * @name value
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {Number} value 0 is no change, -1.0 halves the value, 1.0 doubles, etc..
    * @returns {Number}
    */

})();
;(function () {

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'hue', 0, null, Kinetic.Factory.afterSetFilter);
    /**
    * get/set hsv hue in degrees. Use with {@link Kinetic.Filters.HSV} or {@link Kinetic.Filters.HSL} filter.
    * @name hue
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {Number} hue value between 0 and 359
    * @returns {Number}
    */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'saturation', 0, null, Kinetic.Factory.afterSetFilter);
    /**
    * get/set hsv saturation. Use with {@link Kinetic.Filters.HSV} or {@link Kinetic.Filters.HSL} filter.
    * @name saturation
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {Number} saturation 0 is no change, -1.0 halves the saturation, 1.0 doubles, etc..
    * @returns {Number}
    */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'luminance', 0, null, Kinetic.Factory.afterSetFilter);
    /**
    * get/set hsl luminance. Use with {@link Kinetic.Filters.HSL} filter.
    * @name value
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {Number} value 0 is no change, -1.0 halves the value, 1.0 doubles, etc..
    * @returns {Number}
    */

    /**
    * HSL Filter. Adjusts the hue, saturation and luminance (or lightness)
    * @function
    * @memberof Kinetic.Filters
    * @param {Object} imageData
    * @author ippo615
    * @example
    * image.filters([Kinetic.Filters.HSL]);
    * image.luminance(200);
    */

    Kinetic.Filters.HSL = function (imageData) {
        var data = imageData.data,
            nPixels = data.length,
            v = 1,
            s = Math.pow(2,this.saturation()),
            h = Math.abs((this.hue()) + 360) % 360,
            l = this.luminance()*127,
            i;

        // Basis for the technique used:
        // http://beesbuzz.biz/code/hsv_color_transforms.php
        // V is the value multiplier (1 for none, 2 for double, 0.5 for half)
        // S is the saturation multiplier (1 for none, 2 for double, 0.5 for half)
        // H is the hue shift in degrees (0 to 360)
        // vsu = V*S*cos(H*PI/180);
        // vsw = V*S*sin(H*PI/180);
        //[ .299V+.701vsu+.168vsw    .587V-.587vsu+.330vsw    .114V-.114vsu-.497vsw ] [R]
        //[ .299V-.299vsu-.328vsw    .587V+.413vsu+.035vsw    .114V-.114vsu+.292vsw ]*[G]
        //[ .299V-.300vsu+1.25vsw    .587V-.588vsu-1.05vsw    .114V+.886vsu-.203vsw ] [B]

        // Precompute the values in the matrix:
        var vsu = v*s*Math.cos(h*Math.PI/180),
            vsw = v*s*Math.sin(h*Math.PI/180);
        // (result spot)(source spot)
        var rr = 0.299*v+0.701*vsu+0.167*vsw,
            rg = 0.587*v-0.587*vsu+0.330*vsw,
            rb = 0.114*v-0.114*vsu-0.497*vsw;
        var gr = 0.299*v-0.299*vsu-0.328*vsw,
            gg = 0.587*v+0.413*vsu+0.035*vsw,
            gb = 0.114*v-0.114*vsu+0.293*vsw;
        var br = 0.299*v-0.300*vsu+1.250*vsw,
            bg = 0.587*v-0.586*vsu-1.050*vsw,
            bb = 0.114*v+0.886*vsu-0.200*vsw;

        var r,g,b,a;

        for (i = 0; i < nPixels; i += 4) {
            r = data[i+0];
            g = data[i+1];
            b = data[i+2];
            a = data[i+3];

            data[i+0] = rr*r + rg*g + rb*b + l;
            data[i+1] = gr*r + gg*g + gb*b + l;
            data[i+2] = br*r + bg*g + bb*b + l;
            data[i+3] = a; // alpha
        }
    };
})();
;(function () {
    /**
     * Emboss Filter.
     * Pixastic Lib - Emboss filter - v0.1.0
     * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
     * License: [http://www.pixastic.com/lib/license.txt]
     * @function
     * @memberof Kinetic.Filters
     * @param {Object} imageData
     * @example
     * node.cache();
     * node.filters([Kinetic.Filters.Emboss]);
     * node.embossStrength(0.8);
     * node.embossWhiteLevel(0.3);
     * node.embossDirection('right');
     * node.embossBlend(true);
     */
    Kinetic.Filters.Emboss = function (imageData) {

        // pixastic strength is between 0 and 10.  I want it between 0 and 1
        // pixastic greyLevel is between 0 and 255.  I want it between 0 and 1.  Also,
        // a max value of greyLevel yields a white emboss, and the min value yields a black
        // emboss.  Therefore, I changed greyLevel to whiteLevel
        var strength = this.embossStrength() * 10,
            greyLevel = this.embossWhiteLevel() * 255,
            direction = this.embossDirection(),
            blend = this.embossBlend(),
            dirY = 0,
            dirX = 0,
            data = imageData.data,
            w = imageData.width,
            h = imageData.height,
            w4 = w*4,
            y = h;

        switch (direction) {
            case 'top-left':
                dirY = -1;
                dirX = -1;
                break;
            case 'top':
                dirY = -1;
                dirX = 0;
                break;
            case 'top-right':
                dirY = -1;
                dirX = 1;
                break;
            case 'right':
                dirY = 0;
                dirX = 1;
                break;
            case 'bottom-right':
                dirY = 1;
                dirX = 1;
                break;
            case 'bottom':
                dirY = 1;
                dirX = 0;
                break;
            case 'bottom-left':
                dirY = 1;
                dirX = -1;
                break;
            case 'left':
                dirY = 0;
                dirX = -1;
                break;
        }

        do {
            var offsetY = (y-1)*w4;

            var otherY = dirY;
            if (y + otherY < 1){
                otherY = 0;
            }
            if (y + otherY > h) {
                otherY = 0;
            }

            var offsetYOther = (y-1+otherY)*w*4;

            var x = w;
            do {
                var offset = offsetY + (x-1)*4;

                var otherX = dirX;
                if (x + otherX < 1){
                    otherX = 0;
                }
                if (x + otherX > w) {
                    otherX = 0;
                }

                var offsetOther = offsetYOther + (x-1+otherX)*4;

                var dR = data[offset] - data[offsetOther];
                var dG = data[offset+1] - data[offsetOther+1];
                var dB = data[offset+2] - data[offsetOther+2];

                var dif = dR;
                var absDif = dif > 0 ? dif : -dif;

                var absG = dG > 0 ? dG : -dG;
                var absB = dB > 0 ? dB : -dB;

                if (absG > absDif) {
                    dif = dG;
                }
                if (absB > absDif) {
                    dif = dB;
                }

                dif *= strength;

                if (blend) {
                    var r = data[offset] + dif;
                    var g = data[offset+1] + dif;
                    var b = data[offset+2] + dif;

                    data[offset] = (r > 255) ? 255 : (r < 0 ? 0 : r);
                    data[offset+1] = (g > 255) ? 255 : (g < 0 ? 0 : g);
                    data[offset+2] = (b > 255) ? 255 : (b < 0 ? 0 : b);
                } else {
                    var grey = greyLevel - dif;
                    if (grey < 0) {
                        grey = 0;
                    } else if (grey > 255) {
                        grey = 255;
                    }

                    data[offset] = data[offset+1] = data[offset+2] = grey;
                }

            } while (--x);
        } while (--y);
    };

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'embossStrength', 0.5, null, Kinetic.Factory.afterSetFilter);
    /**
    * get/set emboss strength. Use with {@link Kinetic.Filters.Emboss} filter.
    * @name embossStrength
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {Number} level between 0 and 1.  Default is 0.5
    * @returns {Number}
    */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'embossWhiteLevel', 0.5, null, Kinetic.Factory.afterSetFilter);
    /**
    * get/set emboss white level. Use with {@link Kinetic.Filters.Emboss} filter.
    * @name embossWhiteLevel
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {Number} embossWhiteLevel between 0 and 1.  Default is 0.5
    * @returns {Number}
    */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'embossDirection', 'top-left', null, Kinetic.Factory.afterSetFilter);
    /**
    * get/set emboss direction. Use with {@link Kinetic.Filters.Emboss} filter.
    * @name embossDirection
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {String} embossDirection can be top-left, top, top-right, right, bottom-right, bottom, bottom-left or left
    *   The default is top-left
    * @returns {String}
    */

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'embossBlend', false, null, Kinetic.Factory.afterSetFilter);
    /**
    * get/set emboss blend. Use with {@link Kinetic.Filters.Emboss} filter.
    * @name embossBlend
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {Boolean} embossBlend
    * @returns {Boolean}
    */
})();


;(function () {
    function remap(fromValue, fromMin, fromMax, toMin, toMax) {
        // Compute the range of the data
        var fromRange = fromMax - fromMin,
          toRange = toMax - toMin,
          toValue;

        // If either range is 0, then the value can only be mapped to 1 value
        if (fromRange === 0) {
            return toMin + toRange / 2;
        }
        if (toRange === 0) {
            return toMin;
        }

        // (1) untranslate, (2) unscale, (3) rescale, (4) retranslate
        toValue = (fromValue - fromMin) / fromRange;
        toValue = (toRange * toValue) + toMin;

        return toValue;
    }


    /**
    * Enhance Filter. Adjusts the colors so that they span the widest
    *  possible range (ie 0-255). Performs w*h pixel reads and w*h pixel
    *  writes.
    * @function
    * @name Enhance
    * @memberof Kinetic.Filters
    * @param {Object} imageData
    * @author ippo615
    * @example
    * node.cache();
    * node.filters([Kinetic.Filters.Enhance]);
    * node.enhance(0.4);
    */
    Kinetic.Filters.Enhance = function (imageData) {
        var data = imageData.data,
            nSubPixels = data.length,
            rMin = data[0], rMax = rMin, r,
            gMin = data[1], gMax = gMin, g,
            bMin = data[2], bMax = bMin, b,
            i;

        // If we are not enhancing anything - don't do any computation
        var enhanceAmount = this.enhance();
        if( enhanceAmount === 0 ){ return; }

        // 1st Pass - find the min and max for each channel:
        for (i = 0; i < nSubPixels; i += 4) {
            r = data[i + 0];
            if (r < rMin) { rMin = r; }
            else if (r > rMax) { rMax = r; }
            g = data[i + 1];
            if (g < gMin) { gMin = g; } else
            if (g > gMax) { gMax = g; }
            b = data[i + 2];
            if (b < bMin) { bMin = b; } else
            if (b > bMax) { bMax = b; }
            //a = data[i + 3];
            //if (a < aMin) { aMin = a; } else
            //if (a > aMax) { aMax = a; }
        }

        // If there is only 1 level - don't remap
        if( rMax === rMin ){ rMax = 255; rMin = 0; }
        if( gMax === gMin ){ gMax = 255; gMin = 0; }
        if( bMax === bMin ){ bMax = 255; bMin = 0; }

        var rMid, rGoalMax,rGoalMin,
            gMid, gGoalMax,gGoalMin,
            bMid, bGoalMax,bGoalMin;

        // If the enhancement is positive - stretch the histogram
        if ( enhanceAmount > 0 ){
            rGoalMax = rMax + enhanceAmount*(255-rMax);
            rGoalMin = rMin - enhanceAmount*(rMin-0);
            gGoalMax = gMax + enhanceAmount*(255-gMax);
            gGoalMin = gMin - enhanceAmount*(gMin-0);
            bGoalMax = bMax + enhanceAmount*(255-bMax);
            bGoalMin = bMin - enhanceAmount*(bMin-0);
        // If the enhancement is negative - compress the histogram
        } else {
            rMid = (rMax + rMin)*0.5;
            rGoalMax = rMax + enhanceAmount*(rMax-rMid);
            rGoalMin = rMin + enhanceAmount*(rMin-rMid);
            gMid = (gMax + gMin)*0.5;
            gGoalMax = gMax + enhanceAmount*(gMax-gMid);
            gGoalMin = gMin + enhanceAmount*(gMin-gMid);
            bMid = (bMax + bMin)*0.5;
            bGoalMax = bMax + enhanceAmount*(bMax-bMid);
            bGoalMin = bMin + enhanceAmount*(bMin-bMid);
        }

        // Pass 2 - remap everything, except the alpha
        for (i = 0; i < nSubPixels; i += 4) {
            data[i + 0] = remap(data[i + 0], rMin, rMax, rGoalMin, rGoalMax);
            data[i + 1] = remap(data[i + 1], gMin, gMax, gGoalMin, gGoalMax);
            data[i + 2] = remap(data[i + 2], bMin, bMax, bGoalMin, bGoalMax);
            //data[i + 3] = remap(data[i + 3], aMin, aMax, aGoalMin, aGoalMax);
        }
    };

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'enhance', 0, null, Kinetic.Factory.afterSetFilter);

    /**
    * get/set enhance. Use with {@link Kinetic.Filters.Enhance} filter.
    * @name enhance
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {Float} amount
    * @returns {Float}
    */
})();
;(function () {

    /**
     * Posterize Filter. Adjusts the channels so that there are no more
     *  than n different values for that channel. This is also applied
     *  to the alpha channel.
     * @function
     * @name Posterize
     * @author ippo615
     * @memberof Kinetic.Filters
     * @param {Object} imageData
     * @example
     * node.cache();
     * node.filters([Kinetic.Filters.Posterize]);
     * node.levels(0.8);
     */

    Kinetic.Filters.Posterize = function (imageData) {
        // level must be between 1 and 255
        var levels = Math.round(this.levels() * 254) + 1,
            data = imageData.data,
            len = data.length,
            scale = (255 / levels),
            i;

        for (i = 0; i < len; i += 1) {
            data[i] = Math.floor(data[i] / scale) * scale;
        }
    };

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'levels', 0.5, null, Kinetic.Factory.afterSetFilter);

    /**
    * get/set levels.  Must be a number between 0 and 1.  Use with {@link Kinetic.Filters.Posterize} filter.
    * @name levels
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {Number} level between 0 and 1
    * @returns {Number}
    */
})();;(function () {

    /**
     * Noise Filter. Randomly adds or substracts to the color channels
     * @function
     * @name Noise
     * @memberof Kinetic.Filters
     * @param {Object} imageData
     * @author ippo615
     * @example
     * node.cache();
     * node.filters([Kinetic.Filters.Noise]);
     * node.noise(0.8);
     */
    Kinetic.Filters.Noise = function (imageData) {
        var amount = this.noise() * 255,
            data = imageData.data,
            nPixels = data.length,
            half = amount / 2,
            i;

        for (i = 0; i < nPixels; i += 4) {
            data[i + 0] += half - 2 * half * Math.random();
            data[i + 1] += half - 2 * half * Math.random();
            data[i + 2] += half - 2 * half * Math.random();
        }
    };

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'noise', 0.2, null, Kinetic.Factory.afterSetFilter);

    /**
    * get/set noise amount.  Must be a value between 0 and 1. Use with {@link Kinetic.Filters.Noise} filter.
    * @name noise
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {Number} noise
    * @returns {Number}
    */
})();
;(function () {

    /**
     * Pixelate Filter. Averages groups of pixels and redraws
     *  them as larger pixels
     * @function
     * @name Pixelate
     * @memberof Kinetic.Filters
     * @param {Object} imageData
     * @author ippo615
     * @example
     * node.cache();
     * node.filters([Kinetic.Filters.Pixelate]);
     * node.pixelSize(10);
     */

    Kinetic.Filters.Pixelate = function (imageData) {

        var pixelSize = Math.ceil(this.pixelSize()),
            width = imageData.width,
            height = imageData.height,
            x, y, i,
            //pixelsPerBin = pixelSize * pixelSize,
            red, green, blue, alpha,
            nBinsX = Math.ceil(width / pixelSize),
            nBinsY = Math.ceil(height / pixelSize),
            xBinStart, xBinEnd, yBinStart, yBinEnd,
            xBin, yBin, pixelsInBin;
        imageData = imageData.data;

        for (xBin = 0; xBin < nBinsX; xBin += 1) {
            for (yBin = 0; yBin < nBinsY; yBin += 1) {

                // Initialize the color accumlators to 0
                red = 0;
                green = 0;
                blue = 0;
                alpha = 0;

                // Determine which pixels are included in this bin
                xBinStart = xBin * pixelSize;
                xBinEnd = xBinStart + pixelSize;
                yBinStart = yBin * pixelSize;
                yBinEnd = yBinStart + pixelSize;

                // Add all of the pixels to this bin!
                pixelsInBin = 0;
                for (x = xBinStart; x < xBinEnd; x += 1) {
                    if( x >= width ){ continue; }
                    for (y = yBinStart; y < yBinEnd; y += 1) {
                        if( y >= height ){ continue; }
                        i = (width * y + x) * 4;
                        red += imageData[i + 0];
                        green += imageData[i + 1];
                        blue += imageData[i + 2];
                        alpha += imageData[i + 3];
                        pixelsInBin += 1;
                    }
                }

                // Make sure the channels are between 0-255
                red = red / pixelsInBin;
                green = green / pixelsInBin;
                blue = blue / pixelsInBin;

                // Draw this bin
                for (x = xBinStart; x < xBinEnd; x += 1) {
                    if( x >= width ){ continue; }
                    for (y = yBinStart; y < yBinEnd; y += 1) {
                        if( y >= height ){ continue; }
                        i = (width * y + x) * 4;
                        imageData[i + 0] = red;
                        imageData[i + 1] = green;
                        imageData[i + 2] = blue;
                        imageData[i + 3] = alpha;
                    }
                }
            }
        }

    };

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'pixelSize', 8, null, Kinetic.Factory.afterSetFilter);

    /**
    * get/set pixel size. Use with {@link Kinetic.Filters.Pixelate} filter.
    * @name pixelSize
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {Integer} pixelSize
    * @returns {Integer}
    */
})();;(function () {

    /**
     * Threshold Filter. Pushes any value above the mid point to
     *  the max and any value below the mid point to the min.
     *  This affects the alpha channel.
     * @function
     * @name Threshold
     * @memberof Kinetic.Filters
     * @param {Object} imageData
     * @author ippo615
     * @example
     * node.cache();
     * node.filters([Kinetic.Filters.Threshold]);
     * node.threshold(0.1);
     */

    Kinetic.Filters.Threshold = function (imageData) {
        var level = this.threshold() * 255,
            data = imageData.data,
            len = data.length,
            i;

        for (i = 0; i < len; i += 1) {
            data[i] = data[i] < level ? 0 : 255;
        }
    };

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'threshold', 0.5, null, Kinetic.Factory.afterSetFilter);

    /**
    * get/set threshold.  Must be a value between 0 and 1. Use with {@link Kinetic.Filters.Threshold} or {@link Kinetic.Filters.Mask} filter.
    * @name threshold
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {Number} threshold
    * @returns {Number}
    */
})();;(function() {
    /**
     * Sepia Filter
     * Based on: Pixastic Lib - Sepia filter - v0.1.0
     * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
     * @function
     * @name Sepia
     * @memberof Kinetic.Filters
     * @param {Object} imageData
     * @author Jacob Seidelin <jseidelin@nihilogic.dk>
     * @license MPL v1.1 [http://www.pixastic.com/lib/license.txt]
     * @example
     * node.cache();
     * node.filters([Kinetic.Filters.Sepia]);
     */
    Kinetic.Filters.Sepia = function (imageData) {
        var data = imageData.data,
            w = imageData.width,
            y = imageData.height,
            w4 = w*4,
            offsetY, x, offset, or, og, ob, r, g, b;

        do {
            offsetY = (y-1)*w4;
            x = w;
            do {
                offset = offsetY + (x-1)*4;

                or = data[offset];
                og = data[offset+1];
                ob = data[offset+2];

                r = or * 0.393 + og * 0.769 + ob * 0.189;
                g = or * 0.349 + og * 0.686 + ob * 0.168;
                b = or * 0.272 + og * 0.534 + ob * 0.131;

                data[offset] = r > 255 ? 255 : r;
                data[offset+1] = g > 255 ? 255 : g;
                data[offset+2] = b > 255 ? 255 : b;
                data[offset+3] = data[offset+3];
            } while (--x);
        } while (--y);
    };
})();
;(function () {
    /**
     * Solarize Filter
     * Pixastic Lib - Solarize filter - v0.1.0
     * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
     * License: [http://www.pixastic.com/lib/license.txt]
     * @function
     * @name Solarize
     * @memberof Kinetic.Filters
     * @param {Object} imageData
     * @example
     * node.cache();
     * node.filters([Kinetic.Filters.Solarize]);
     */
    Kinetic.Filters.Solarize = function (imageData) {
        var data = imageData.data,
            w = imageData.width,
            h = imageData.height,
            w4 = w*4,
            y = h;

        do {
            var offsetY = (y-1)*w4;
            var x = w;
            do {
                var offset = offsetY + (x-1)*4;
                var r = data[offset];
                var g = data[offset+1];
                var b = data[offset+2];

                if (r > 127) {
                    r = 255 - r;
                }
                if (g > 127) {
                    g = 255 - g;
                }
                if (b > 127) {
                    b = 255 - b;
                }

                data[offset] = r;
                data[offset+1] = g;
                data[offset+2] = b;
            } while (--x);
        } while (--y);
    };
})();


;/*jshint newcap:false */
(function () {

  /*
   * ToPolar Filter. Converts image data to polar coordinates. Performs
   *  w*h*4 pixel reads and w*h pixel writes. The r axis is placed along
   *  what would be the y axis and the theta axis along the x axis.
   * @function
   * @author ippo615
   * @memberof Kinetic.Filters
   * @param {ImageData} src, the source image data (what will be transformed)
   * @param {ImageData} dst, the destination image data (where it will be saved)
   * @param {Object} opt
   * @param {Number} [opt.polarCenterX] horizontal location for the center of the circle,
   *  default is in the middle
   * @param {Number} [opt.polarCenterY] vertical location for the center of the circle,
   *  default is in the middle
   */

    var ToPolar = function(src,dst,opt){

        var srcPixels = src.data,
            dstPixels = dst.data,
            xSize = src.width,
            ySize = src.height,
            xMid = opt.polarCenterX || xSize/2,
            yMid = opt.polarCenterY || ySize/2,
            i, x, y, r=0,g=0,b=0,a=0;

        // Find the largest radius
        var rad, rMax = Math.sqrt( xMid*xMid + yMid*yMid );
        x = xSize - xMid;
        y = ySize - yMid;
        rad = Math.sqrt( x*x + y*y );
        rMax = (rad > rMax)?rad:rMax;

        // We'll be uisng y as the radius, and x as the angle (theta=t)
        var rSize = ySize,
            tSize = xSize,
            radius, theta;

        // We want to cover all angles (0-360) and we need to convert to
        // radians (*PI/180)
        var conversion = 360/tSize*Math.PI/180, sin, cos;

        // var x1, x2, x1i, x2i, y1, y2, y1i, y2i, scale;

        for( theta=0; theta<tSize; theta+=1 ){
            sin = Math.sin(theta*conversion);
            cos = Math.cos(theta*conversion);
            for( radius=0; radius<rSize; radius+=1 ){
                x = Math.floor(xMid+rMax*radius/rSize*cos);
                y = Math.floor(yMid+rMax*radius/rSize*sin);
                i = (y*xSize + x)*4;
                r = srcPixels[i+0];
                g = srcPixels[i+1];
                b = srcPixels[i+2];
                a = srcPixels[i+3];

                // Store it
                //i = (theta * xSize + radius) * 4;
                i = (theta + radius*xSize) * 4;
                dstPixels[i+0] = r;
                dstPixels[i+1] = g;
                dstPixels[i+2] = b;
                dstPixels[i+3] = a;

            }
        }
    };

    /*
     * FromPolar Filter. Converts image data from polar coordinates back to rectangular.
     *  Performs w*h*4 pixel reads and w*h pixel writes.
     * @function
     * @author ippo615
     * @memberof Kinetic.Filters
     * @param {ImageData} src, the source image data (what will be transformed)
     * @param {ImageData} dst, the destination image data (where it will be saved)
     * @param {Object} opt
     * @param {Number} [opt.polarCenterX] horizontal location for the center of the circle,
     *  default is in the middle
     * @param {Number} [opt.polarCenterY] vertical location for the center of the circle,
     *  default is in the middle
     * @param {Number} [opt.polarRotation] amount to rotate the image counterclockwis,
     *  0 is no rotation, 360 degrees is a full rotation
     */

    var FromPolar = function(src,dst,opt){

        var srcPixels = src.data,
            dstPixels = dst.data,
            xSize = src.width,
            ySize = src.height,
            xMid = opt.polarCenterX || xSize/2,
            yMid = opt.polarCenterY || ySize/2,
            i, x, y, dx, dy, r=0,g=0,b=0,a=0;


        // Find the largest radius
        var rad, rMax = Math.sqrt( xMid*xMid + yMid*yMid );
        x = xSize - xMid;
        y = ySize - yMid;
        rad = Math.sqrt( x*x + y*y );
        rMax = (rad > rMax)?rad:rMax;

        // We'll be uisng x as the radius, and y as the angle (theta=t)
        var rSize = ySize,
        tSize = xSize,
        radius, theta,
        phaseShift = opt.polarRotation || 0;

        // We need to convert to degrees and we need to make sure
        // it's between (0-360)
        // var conversion = tSize/360*180/Math.PI;
        //var conversion = tSize/360*180/Math.PI;

        var x1, y1;

        for( x=0; x<xSize; x+=1 ){
            for( y=0; y<ySize; y+=1 ){
                dx = x - xMid;
                dy = y - yMid;
                radius = Math.sqrt(dx*dx + dy*dy)*rSize/rMax;
                theta = (Math.atan2(dy,dx)*180/Math.PI + 360 + phaseShift)%360;
                theta = theta*tSize/360;
                x1 = Math.floor(theta);
                y1 = Math.floor(radius);
                i = (y1*xSize + x1)*4;
                r = srcPixels[i+0];
                g = srcPixels[i+1];
                b = srcPixels[i+2];
                a = srcPixels[i+3];

                // Store it
                i = (y*xSize + x)*4;
                dstPixels[i+0] = r;
                dstPixels[i+1] = g;
                dstPixels[i+2] = b;
                dstPixels[i+3] = a;
            }
        }

    };

    //Kinetic.Filters.ToPolar = Kinetic.Util._FilterWrapDoubleBuffer(ToPolar);
    //Kinetic.Filters.FromPolar = Kinetic.Util._FilterWrapDoubleBuffer(FromPolar);

    // create a temporary canvas for working - shared between multiple calls
    var tempCanvas = Kinetic.Util.createCanvasElement();

    /*
     * Kaleidoscope Filter.
     * @function
     * @name Kaleidoscope
     * @author ippo615
     * @memberof Kinetic.Filters
     * @example
     * node.cache();
     * node.filters([Kinetic.Filters.Kaleidoscope]);
     * node.kaleidoscopePower(3);
     * node.kaleidoscopeAngle(45);
     */
    Kinetic.Filters.Kaleidoscope = function(imageData){
        var xSize = imageData.width,
            ySize = imageData.height;

        var x,y,xoff,i, r,g,b,a, srcPos, dstPos;
        var power = Math.round( this.kaleidoscopePower() );
        var angle = Math.round( this.kaleidoscopeAngle() );
        var offset = Math.floor(xSize*(angle%360)/360);

        if( power < 1 ){return;}

        // Work with our shared buffer canvas
        tempCanvas.width = xSize;
        tempCanvas.height = ySize;
        var scratchData = tempCanvas.getContext('2d').getImageData(0,0,xSize,ySize);

        // Convert thhe original to polar coordinates
        ToPolar( imageData, scratchData, {
            polarCenterX:xSize/2,
            polarCenterY:ySize/2
        });

        // Determine how big each section will be, if it's too small
        // make it bigger
        var minSectionSize = xSize / Math.pow(2,power);
        while( minSectionSize <= 8){
            minSectionSize = minSectionSize*2;
            power -= 1;
        }
        minSectionSize = Math.ceil(minSectionSize);
        var sectionSize = minSectionSize;

        // Copy the offset region to 0
        // Depending on the size of filter and location of the offset we may need
        // to copy the section backwards to prevent it from rewriting itself
        var xStart = 0,
          xEnd = sectionSize,
          xDelta = 1;
        if( offset+minSectionSize > xSize ){
            xStart = sectionSize;
            xEnd = 0;
            xDelta = -1;
        }
        for( y=0; y<ySize; y+=1 ){
            for( x=xStart; x !== xEnd; x+=xDelta ){
                xoff = Math.round(x+offset)%xSize;
                srcPos = (xSize*y+xoff)*4;
                r = scratchData.data[srcPos+0];
                g = scratchData.data[srcPos+1];
                b = scratchData.data[srcPos+2];
                a = scratchData.data[srcPos+3];
                dstPos = (xSize*y+x)*4;
                scratchData.data[dstPos+0] = r;
                scratchData.data[dstPos+1] = g;
                scratchData.data[dstPos+2] = b;
                scratchData.data[dstPos+3] = a;
            }
        }

        // Perform the actual effect
        for( y=0; y<ySize; y+=1 ){
            sectionSize = Math.floor( minSectionSize );
            for( i=0; i<power; i+=1 ){
                for( x=0; x<sectionSize+1; x+=1 ){
                    srcPos = (xSize*y+x)*4;
                    r = scratchData.data[srcPos+0];
                    g = scratchData.data[srcPos+1];
                    b = scratchData.data[srcPos+2];
                    a = scratchData.data[srcPos+3];
                    dstPos = (xSize*y+sectionSize*2-x-1)*4;
                    scratchData.data[dstPos+0] = r;
                    scratchData.data[dstPos+1] = g;
                    scratchData.data[dstPos+2] = b;
                    scratchData.data[dstPos+3] = a;
                }
                sectionSize *= 2;
            }
        }

        // Convert back from polar coordinates
        FromPolar(scratchData,imageData,{polarRotation:0});
    };

    /**
    * get/set kaleidoscope power. Use with {@link Kinetic.Filters.Kaleidoscope} filter.
    * @name kaleidoscopePower
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {Integer} power of kaleidoscope
    * @returns {Integer}
    */
    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'kaleidoscopePower', 2, null, Kinetic.Factory.afterSetFilter);

    /**
    * get/set kaleidoscope angle. Use with {@link Kinetic.Filters.Kaleidoscope} filter.
    * @name kaleidoscopeAngle
    * @method
    * @memberof Kinetic.Node.prototype
    * @param {Integer} degrees
    * @returns {Integer}
    */
    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'kaleidoscopeAngle', 0, null, Kinetic.Factory.afterSetFilter);

})();
;(function() {
    var BATCH_DRAW_STOP_TIME_DIFF = 500;

    var now =(function() {
        if (Kinetic.root.performance && Kinetic.root.performance.now) {
            return function() {
                return Kinetic.root.performance.now();
            };
        }
        else {
            return function() {
                return new Date().getTime();
            };
        }
    })();

    var RAF = (function() {
        return Kinetic.root.requestAnimationFrame
            || Kinetic.root.webkitRequestAnimationFrame
            || Kinetic.root.mozRequestAnimationFrame
            || Kinetic.root.oRequestAnimationFrame
            || Kinetic.root.msRequestAnimationFrame
            || FRAF;
    })();

    function FRAF(callback) {
        setTimeout(callback, 1000 / 60);
    }

    function requestAnimFrame() {
        return RAF.apply(Kinetic.root, arguments);
    }

    /**
     * Animation constructor.  A stage is used to contain multiple layers and handle
     * @constructor
     * @memberof Kinetic
     * @param {Function} func function executed on each animation frame.  The function is passed a frame object, which contains
     *  timeDiff, lastTime, time, and frameRate properties.  The timeDiff property is the number of milliseconds that have passed
     *  since the last animation frame.  The lastTime property is time in milliseconds that elapsed from the moment the animation started
     *  to the last animation frame.  The time property is the time in milliseconds that ellapsed from the moment the animation started
     *  to the current animation frame.  The frameRate property is the current frame rate in frames / second. Return false from function,
     *  if you don't need to redraw layer/layers on some frames.
     * @param {Kinetic.Layer|Array} [layers] layer(s) to be redrawn on each animation frame. Can be a layer, an array of layers, or null.
     *  Not specifying a node will result in no redraw.
     * @example
     * // move a node to the right at 50 pixels / second
     * var velocity = 50;
     *
     * var anim = new Kinetic.Animation(function(frame) {
     *   var dist = velocity * (frame.timeDiff / 1000);
     *   node.move(dist, 0);
     * }, layer);
     *
     * anim.start();
     */
    Kinetic.Animation = function(func, layers) {
        var Anim = Kinetic.Animation;
        this.func = func;
        this.setLayers(layers);
        this.id = Anim.animIdCounter++;
        this.frame = {
            time: 0,
            timeDiff: 0,
            lastTime: now()
        };
    };
    /*
     * Animation methods
     */
    Kinetic.Animation.prototype = {
        /**
         * set layers to be redrawn on each animation frame
         * @method
         * @memberof Kinetic.Animation.prototype
         * @param {Kinetic.Layer|Array} [layers] layer(s) to be redrawn.&nbsp; Can be a layer, an array of layers, or null.  Not specifying a node will result in no redraw.
         */
        setLayers: function(layers) {
            var lays = [];
            // if passing in no layers
            if (!layers) {
                lays = [];
            }
            // if passing in an array of Layers
            // NOTE: layers could be an array or Kinetic.Collection.  for simplicity, I'm just inspecting
            // the length property to check for both cases
            else if (layers.length > 0) {
                lays = layers;
            }
            // if passing in a Layer
            else {
                lays = [layers];
            }

            this.layers = lays;
        },
        /**
         * get layers
         * @method
         * @memberof Kinetic.Animation.prototype
         */
        getLayers: function() {
            return this.layers;
        },
        /**
         * add layer.  Returns true if the layer was added, and false if it was not
         * @method
         * @memberof Kinetic.Animation.prototype
         * @param {Kinetic.Layer} layer
         */
        addLayer: function(layer) {
            var layers = this.layers,
                len, n;

            if (layers) {
                len = layers.length;

                // don't add the layer if it already exists
                for (n = 0; n < len; n++) {
                    if (layers[n]._id === layer._id) {
                        return false;
                    }
                }
            }
            else {
                this.layers = [];
            }

            this.layers.push(layer);
            return true;
        },
        /**
         * determine if animation is running or not.  returns true or false
         * @method
         * @memberof Kinetic.Animation.prototype
         */
        isRunning: function() {
            var a = Kinetic.Animation,
                animations = a.animations,
                len = animations.length,
                n;

            for(n = 0; n < len; n++) {
                if(animations[n].id === this.id) {
                    return true;
                }
            }
            return false;
        },
        /**
         * start animation
         * @method
         * @memberof Kinetic.Animation.prototype
         */
        start: function() {
            var Anim = Kinetic.Animation;
            this.stop();
            this.frame.timeDiff = 0;
            this.frame.lastTime = now();
            Anim._addAnimation(this);
        },
        /**
         * stop animation
         * @method
         * @memberof Kinetic.Animation.prototype
         */
        stop: function() {
            Kinetic.Animation._removeAnimation(this);
        },
        _updateFrameObject: function(time) {
            this.frame.timeDiff = time - this.frame.lastTime;
            this.frame.lastTime = time;
            this.frame.time += this.frame.timeDiff;
            this.frame.frameRate = 1000 / this.frame.timeDiff;
        }
    };
    Kinetic.Animation.animations = [];
    Kinetic.Animation.animIdCounter = 0;
    Kinetic.Animation.animRunning = false;

    Kinetic.Animation._addAnimation = function(anim) {
        this.animations.push(anim);
        this._handleAnimation();
    };
    Kinetic.Animation._removeAnimation = function(anim) {
        var id = anim.id,
            animations = this.animations,
            len = animations.length,
            n;

        for(n = 0; n < len; n++) {
            if(animations[n].id === id) {
                this.animations.splice(n, 1);
                break;
            }
        }
    };

    Kinetic.Animation._runFrames = function() {
        var layerHash = {},
            animations = this.animations,
            anim, layers, func, n, i, layersLen, layer, key, needRedraw;
        /*
         * loop through all animations and execute animation
         *  function.  if the animation object has specified node,
         *  we can add the node to the nodes hash to eliminate
         *  drawing the same node multiple times.  The node property
         *  can be the stage itself or a layer
         */
        /*
         * WARNING: don't cache animations.length because it could change while
         * the for loop is running, causing a JS error
         */

        for(n = 0; n < animations.length; n++) {
            anim = animations[n];
            layers = anim.layers;
            func = anim.func;


            anim._updateFrameObject(now());
            layersLen = layers.length;

            // if animation object has a function, execute it
            if (func) {
                // allow anim bypassing drawing
                needRedraw = (func.call(anim, anim.frame) !== false);
            } else {
                needRedraw = true;
            }
            if (needRedraw) {
                for (i = 0; i < layersLen; i++) {
                    layer = layers[i];

                    if (layer._id !== undefined) {
                        layerHash[layer._id] = layer;
                    }
                }
            }
        }

        for (key in layerHash) {
            layerHash[key].draw();
        }
    };
    Kinetic.Animation._animationLoop = function() {
        var Anim = Kinetic.Animation;

        if(Anim.animations.length) {
            requestAnimFrame(Anim._animationLoop);
            Anim._runFrames();
        }
        else {
            Anim.animRunning = false;
        }
    };
    Kinetic.Animation._handleAnimation = function() {
        var that = this;
        if(!this.animRunning) {
            this.animRunning = true;
            that._animationLoop();
        }
    };

    var moveTo = Kinetic.Node.prototype.moveTo;
    Kinetic.Node.prototype.moveTo = function(container) {
        moveTo.call(this, container);
    };

    /**
     * batch draw
     * @method
     * @memberof Kinetic.Base.prototype
     */
    Kinetic.BaseLayer.prototype.batchDraw = function() {
        var that = this,
            Anim = Kinetic.Animation;

        if (!this.batchAnim) {
            this.batchAnim = new Anim(function() {
                if (that.lastBatchDrawTime && now() - that.lastBatchDrawTime > BATCH_DRAW_STOP_TIME_DIFF) {
                    that.batchAnim.stop();
                }
            }, this);
        }

        this.lastBatchDrawTime = now();

        if (!this.batchAnim.isRunning()) {
            this.draw();
            this.batchAnim.start();
        }
    };

    /**
     * batch draw
     * @method
     * @memberof Kinetic.Stage.prototype
     */
    Kinetic.Stage.prototype.batchDraw = function() {
        this.getChildren().each(function(layer) {
            layer.batchDraw();
        });
    };
})(this);
;(function() {
    var blacklist = {
        node: 1,
        duration: 1,
        easing: 1,
        onFinish: 1,
        yoyo: 1
    },

    PAUSED = 1,
    PLAYING = 2,
    REVERSING = 3,

    idCounter = 0;

    /**
     * Tween constructor.  Tweens enable you to animate a node between the current state and a new state.
     *  You can play, pause, reverse, seek, reset, and finish tweens.  By default, tweens are animated using
     *  a linear easing.  For more tweening options, check out {@link Kinetic.Easings}
     * @constructor
     * @memberof Kinetic
     * @example
     * // instantiate new tween which fully rotates a node in 1 second
     * var tween = new Kinetic.Tween({
     *   node: node,
     *   rotationDeg: 360,
     *   duration: 1,
     *   easing: Kinetic.Easings.EaseInOut
     * });
     *
     * // play tween
     * tween.play();
     *
     * // pause tween
     * tween.pause();
     */
    Kinetic.Tween = function(config) {
        var that = this,
            node = config.node,
            nodeId = node._id,
            duration,
            easing = config.easing || Kinetic.Easings.Linear,
            yoyo = !!config.yoyo,
            key;

        if (typeof config.duration === 'undefined') {
            duration = 1;
        } else if (config.duration === 0) {  // zero is bad value for duration
            duration = 0.001;
        } else {
            duration = config.duration;
        }
        this.node = node;
        this._id = idCounter++;

        this.anim = new Kinetic.Animation(function() {
            that.tween.onEnterFrame();
        }, node.getLayer() || ((node instanceof Kinetic.Stage) ? node.getLayers() : null));

        this.tween = new Tween(key, function(i) {
            that._tweenFunc(i);
        }, easing, 0, 1, duration * 1000, yoyo);

        this._addListeners();

        // init attrs map
        if (!Kinetic.Tween.attrs[nodeId]) {
            Kinetic.Tween.attrs[nodeId] = {};
        }
        if (!Kinetic.Tween.attrs[nodeId][this._id]) {
            Kinetic.Tween.attrs[nodeId][this._id] = {};
        }
        // init tweens map
        if (!Kinetic.Tween.tweens[nodeId]) {
            Kinetic.Tween.tweens[nodeId] = {};
        }

        for (key in config) {
            if (blacklist[key] === undefined) {
                this._addAttr(key, config[key]);
            }
        }

        this.reset();

        // callbacks
        this.onFinish = config.onFinish;
        this.onReset = config.onReset;
    };

    // start/diff object = attrs.nodeId.tweenId.attr
    Kinetic.Tween.attrs = {};
    // tweenId = tweens.nodeId.attr
    Kinetic.Tween.tweens = {};

    Kinetic.Tween.prototype = {
        _addAttr: function(key, end) {
            var node = this.node,
                nodeId = node._id,
                start, diff, tweenId, n, len;

            // remove conflict from tween map if it exists
            tweenId = Kinetic.Tween.tweens[nodeId][key];

            if (tweenId) {
                delete Kinetic.Tween.attrs[nodeId][tweenId][key];
            }

            // add to tween map
            start = node.getAttr(key);

            if (Kinetic.Util._isArray(end)) {
                diff = [];
                len = end.length;
                for (n=0; n<len; n++) {
                    diff.push(end[n] - start[n]);
                }

            }
            else {
                diff = end - start;
            }

            Kinetic.Tween.attrs[nodeId][this._id][key] = {
                start: start,
                diff: diff
            };
            Kinetic.Tween.tweens[nodeId][key] = this._id;
        },
        _tweenFunc: function(i) {
            var node = this.node,
                attrs = Kinetic.Tween.attrs[node._id][this._id],
                key, attr, start, diff, newVal, n, len;

            for (key in attrs) {
                attr = attrs[key];
                start = attr.start;
                diff = attr.diff;

                if (Kinetic.Util._isArray(start)) {
                    newVal = [];
                    len = start.length;
                    for (n=0; n<len; n++) {
                        newVal.push(start[n] + (diff[n] * i));
                    }
                }
                else {
                    newVal = start + (diff * i);
                }

                node.setAttr(key, newVal);
            }
        },
        _addListeners: function() {
            var that = this;

            // start listeners
            this.tween.onPlay = function() {
                that.anim.start();
            };
            this.tween.onReverse = function() {
                that.anim.start();
            };

            // stop listeners
            this.tween.onPause = function() {
                that.anim.stop();
            };
            this.tween.onFinish = function() {
                if (that.onFinish) {
                    that.onFinish();
                }
            };
            this.tween.onReset = function() {
                if (that.onReset) {
                    that.onReset();
                }
            };
        },
        /**
         * play
         * @method
         * @memberof Kinetic.Tween.prototype
         * @returns {Tween}
         */
        play: function() {
            this.tween.play();
            return this;
        },
        /**
         * reverse
         * @method
         * @memberof Kinetic.Tween.prototype
         * @returns {Tween}
         */
        reverse: function() {
            this.tween.reverse();
            return this;
        },
        /**
         * reset
         * @method
         * @memberof Kinetic.Tween.prototype
         * @returns {Tween}
         */
        reset: function() {
            this.tween.reset();
            return this;
        },
        /**
         * seek
         * @method
         * @memberof Kinetic.Tween.prototype
         * @param {Integer} t time in seconds between 0 and the duration
         * @returns {Tween}
         */
        seek: function(t) {
            this.tween.seek(t * 1000);
            return this;
        },
        /**
         * pause
         * @method
         * @memberof Kinetic.Tween.prototype
         * @returns {Tween}
         */
        pause: function() {
            this.tween.pause();
            return this;
        },
        /**
         * finish
         * @method
         * @memberof Kinetic.Tween.prototype
         * @returns {Tween}
         */
        finish: function() {
            this.tween.finish();
            return this;
        },
        /**
         * destroy
         * @method
         * @memberof Kinetic.Tween.prototype
         */
        destroy: function() {
            var nodeId = this.node._id,
                thisId = this._id,
                attrs = Kinetic.Tween.tweens[nodeId],
                key;

            this.pause();

            for (key in attrs) {
                delete Kinetic.Tween.tweens[nodeId][key];
            }

            delete Kinetic.Tween.attrs[nodeId][thisId];
        }
    };

    var Tween = function(prop, propFunc, func, begin, finish, duration, yoyo) {
        this.prop = prop;
        this.propFunc = propFunc;
        this.begin = begin;
        this._pos = begin;
        this.duration = duration;
        this._change = 0;
        this.prevPos = 0;
        this.yoyo = yoyo;
        this._time = 0;
        this._position = 0;
        this._startTime = 0;
        this._finish = 0;
        this.func = func;
        this._change = finish - this.begin;
        this.pause();
    };
    /*
     * Tween methods
     */
    Tween.prototype = {
        fire: function(str) {
            var handler = this[str];
            if (handler) {
                handler();
            }
        },
        setTime: function(t) {
            if(t > this.duration) {
                if(this.yoyo) {
                    this._time = this.duration;
                    this.reverse();
                }
                else {
                    this.finish();
                }
            }
            else if(t < 0) {
                if(this.yoyo) {
                    this._time = 0;
                    this.play();
                }
                else {
                    this.reset();
                }
            }
            else {
                this._time = t;
                this.update();
            }
        },
        getTime: function() {
            return this._time;
        },
        setPosition: function(p) {
            this.prevPos = this._pos;
            this.propFunc(p);
            this._pos = p;
        },
        getPosition: function(t) {
            if(t === undefined) {
                t = this._time;
            }
            return this.func(t, this.begin, this._change, this.duration);
        },
        play: function() {
            this.state = PLAYING;
            this._startTime = this.getTimer() - this._time;
            this.onEnterFrame();
            this.fire('onPlay');
        },
        reverse: function() {
            this.state = REVERSING;
            this._time = this.duration - this._time;
            this._startTime = this.getTimer() - this._time;
            this.onEnterFrame();
            this.fire('onReverse');
        },
        seek: function(t) {
            this.pause();
            this._time = t;
            this.update();
            this.fire('onSeek');
        },
        reset: function() {
            this.pause();
            this._time = 0;
            this.update();
            this.fire('onReset');
        },
        finish: function() {
            this.pause();
            this._time = this.duration;
            this.update();
            this.fire('onFinish');
        },
        update: function() {
            this.setPosition(this.getPosition(this._time));
        },
        onEnterFrame: function() {
            var t = this.getTimer() - this._startTime;
            if(this.state === PLAYING) {
                this.setTime(t);
            }
            else if (this.state === REVERSING) {
                this.setTime(this.duration - t);
            }
        },
        pause: function() {
            this.state = PAUSED;
            this.fire('onPause');
        },
        getTimer: function() {
            return new Date().getTime();
        }
    };

    /*
    * These eases were ported from an Adobe Flash tweening library to JavaScript
    * by Xaric
    */

    /**
     * @namespace Easings
     * @memberof Kinetic
     */
    Kinetic.Easings = {
        /**
        * back ease in
        * @function
        * @memberof Kinetic.Easings
        */
        'BackEaseIn': function(t, b, c, d) {
            var s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        /**
        * back ease out
        * @function
        * @memberof Kinetic.Easings
        */
        'BackEaseOut': function(t, b, c, d) {
            var s = 1.70158;
            return c * (( t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        /**
        * back ease in out
        * @function
        * @memberof Kinetic.Easings
        */
        'BackEaseInOut': function(t, b, c, d) {
            var s = 1.70158;
            if((t /= d / 2) < 1) {
                return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            }
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
        /**
        * elastic ease in
        * @function
        * @memberof Kinetic.Easings
        */
        'ElasticEaseIn': function(t, b, c, d, a, p) {
            // added s = 0
            var s = 0;
            if(t === 0) {
                return b;
            }
            if((t /= d) == 1) {
                return b + c;
            }
            if(!p) {
                p = d * 0.3;
            }
            if(!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            }
            else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        /**
        * elastic ease out
        * @function
        * @memberof Kinetic.Easings
        */
        'ElasticEaseOut': function(t, b, c, d, a, p) {
            // added s = 0
            var s = 0;
            if(t === 0) {
                return b;
            }
            if((t /= d) == 1) {
                return b + c;
            }
            if(!p) {
                p = d * 0.3;
            }
            if(!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            }
            else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        /**
        * elastic ease in out
        * @function
        * @memberof Kinetic.Easings
        */
        'ElasticEaseInOut': function(t, b, c, d, a, p) {
            // added s = 0
            var s = 0;
            if(t === 0) {
                return b;
            }
            if((t /= d / 2) == 2) {
                return b + c;
            }
            if(!p) {
                p = d * (0.3 * 1.5);
            }
            if(!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            }
            else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            if(t < 1) {
                return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            }
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
        },
        /**
        * bounce ease out
        * @function
        * @memberof Kinetic.Easings
        */
        'BounceEaseOut': function(t, b, c, d) {
            if((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            }
            else if(t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
            }
            else if(t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
            }
            else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
            }
        },
        /**
        * bounce ease in
        * @function
        * @memberof Kinetic.Easings
        */
        'BounceEaseIn': function(t, b, c, d) {
            return c - Kinetic.Easings.BounceEaseOut(d - t, 0, c, d) + b;
        },
        /**
        * bounce ease in out
        * @function
        * @memberof Kinetic.Easings
        */
        'BounceEaseInOut': function(t, b, c, d) {
            if(t < d / 2) {
                return Kinetic.Easings.BounceEaseIn(t * 2, 0, c, d) * 0.5 + b;
            }
            else {
                return Kinetic.Easings.BounceEaseOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
            }
        },
        /**
        * ease in
        * @function
        * @memberof Kinetic.Easings
        */
        'EaseIn': function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        /**
        * ease out
        * @function
        * @memberof Kinetic.Easings
        */
        'EaseOut': function(t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        /**
        * ease in out
        * @function
        * @memberof Kinetic.Easings
        */
        'EaseInOut': function(t, b, c, d) {
            if((t /= d / 2) < 1) {
                return c / 2 * t * t + b;
            }
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        /**
        * strong ease in
        * @function
        * @memberof Kinetic.Easings
        */
        'StrongEaseIn': function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        /**
        * strong ease out
        * @function
        * @memberof Kinetic.Easings
        */
        'StrongEaseOut': function(t, b, c, d) {
            return c * (( t = t / d - 1) * t * t * t * t + 1) + b;
        },
        /**
        * strong ease in out
        * @function
        * @memberof Kinetic.Easings
        */
        'StrongEaseInOut': function(t, b, c, d) {
            if((t /= d / 2) < 1) {
                return c / 2 * t * t * t * t * t + b;
            }
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        /**
        * linear
        * @function
        * @memberof Kinetic.Easings
        */
        'Linear': function(t, b, c, d) {
            return c * t / d + b;
        }
    };
})();
;(function() {
    Kinetic.DD = {
        // properties
        anim: new Kinetic.Animation(function() {
            var b = this.dirty;
            this.dirty = false;
            return b;
        }),
        isDragging: false,
        justDragged: false,
        offset: {
            x: 0,
            y: 0
        },
        node: null,

        // methods
        _drag: function(evt) {
            var dd = Kinetic.DD,
                node = dd.node;

            if(node) {
               if(!dd.isDragging) {
                    var pos = node.getStage().getPointerPosition();
                    var dragDistance = node.dragDistance();
                    var distance = Math.max(
                        Math.abs(pos.x - dd.startPointerPos.x),
                        Math.abs(pos.y - dd.startPointerPos.y)
                    );
                    if (distance < dragDistance) {
                        return;
                    }
                }

                node._setDragPosition(evt);
                if(!dd.isDragging) {
                    dd.isDragging = true;
                    node.fire('dragstart', {
                        type : 'dragstart',
                        target : node,
                        evt : evt
                    }, true);
                }

                // execute ondragmove if defined
                node.fire('dragmove', {
                    type : 'dragmove',
                    target : node,
                    evt : evt
                }, true);
            }
        },
        _endDragBefore: function(evt) {
            var dd = Kinetic.DD,
                node = dd.node,
                nodeType, layer;

            if(node) {
                nodeType = node.nodeType;
                layer = node.getLayer();
                dd.anim.stop();

                // only fire dragend event if the drag and drop
                // operation actually started.
                if(dd.isDragging) {
                    dd.isDragging = false;
                    dd.justDragged = true;
                    Kinetic.listenClickTap = false;

                    if (evt) {
                        evt.dragEndNode = node;
                    }
                }

                delete dd.node;

                (layer || node).draw();
            }
        },
        _endDragAfter: function(evt) {
            evt = evt || {};

            var dragEndNode = evt.dragEndNode;

            if (evt && dragEndNode) {
                dragEndNode.fire('dragend', {
                    type : 'dragend',
                    target : dragEndNode,
                    evt : evt
                }, true);
            }
        }
    };

    // Node extenders

    /**
     * initiate drag and drop
     * @method
     * @memberof Kinetic.Node.prototype
     */
    Kinetic.Node.prototype.startDrag = function() {
        var dd = Kinetic.DD,
            stage = this.getStage(),
            layer = this.getLayer(),
            pos = stage.getPointerPosition(),
            ap = this.getAbsolutePosition();

        if(pos) {
            if (dd.node) {
                dd.node.stopDrag();
            }

            dd.node = this;
            dd.startPointerPos = pos;
            dd.offset.x = pos.x - ap.x;
            dd.offset.y = pos.y - ap.y;
            dd.anim.setLayers(layer || this.getLayers());
            dd.anim.start();

            this._setDragPosition();
        }
    };

    Kinetic.Node.prototype._setDragPosition = function(evt) {
        var dd = Kinetic.DD,
            pos = this.getStage().getPointerPosition(),
            dbf = this.getDragBoundFunc();
        if (!pos) {
            return;
        }
        var newNodePos = {
            x: pos.x - dd.offset.x,
            y: pos.y - dd.offset.y
        };

        if(dbf !== undefined) {
            newNodePos = dbf.call(this, newNodePos, evt);
        }
        this.setAbsolutePosition(newNodePos);

        if (!this._lastPos || this._lastPos.x !== newNodePos.x ||
            this._lastPos.y !== newNodePos.y) {
            dd.anim.dirty = true;
        }

        this._lastPos = newNodePos;
    };

    /**
     * stop drag and drop
     * @method
     * @memberof Kinetic.Node.prototype
     */
    Kinetic.Node.prototype.stopDrag = function() {
        var dd = Kinetic.DD,
            evt = {};
        dd._endDragBefore(evt);
        dd._endDragAfter(evt);
    };

    Kinetic.Node.prototype.setDraggable = function(draggable) {
        this._setAttr('draggable', draggable);
        this._dragChange();
    };

    var origDestroy = Kinetic.Node.prototype.destroy;

    Kinetic.Node.prototype.destroy = function() {
        var dd = Kinetic.DD;

        // stop DD
        if(dd.node && dd.node._id === this._id) {

            this.stopDrag();
        }

        origDestroy.call(this);
    };

    /**
     * determine if node is currently in drag and drop mode
     * @method
     * @memberof Kinetic.Node.prototype
     */
    Kinetic.Node.prototype.isDragging = function() {
        var dd = Kinetic.DD;
        return !!(dd.node && dd.node._id === this._id && dd.isDragging);
    };

    Kinetic.Node.prototype._listenDrag = function() {
        var that = this;

        this._dragCleanup();

        if (this.getClassName() === 'Stage') {
            this.on('contentMousedown.kinetic contentTouchstart.kinetic', function(evt) {
                if(!Kinetic.DD.node) {
                    that.startDrag(evt);
                }
            });
        }
        else {
            this.on('mousedown.kinetic touchstart.kinetic', function(evt) {
                // ignore right and middle buttons
                if (evt.evt.button === 1 || evt.evt.button === 2) {
                    return;
                }
                if(!Kinetic.DD.node) {
                    that.startDrag(evt);
                }
            });
        }

        // listening is required for drag and drop
        /*
        this._listeningEnabled = true;
        this._clearSelfAndAncestorCache('listeningEnabled');
        */
    };

    Kinetic.Node.prototype._dragChange = function() {
        if(this.attrs.draggable) {
            this._listenDrag();
        }
        else {
            // remove event listeners
            this._dragCleanup();

            /*
             * force drag and drop to end
             * if this node is currently in
             * drag and drop mode
             */
            var stage = this.getStage();
            var dd = Kinetic.DD;
            if(stage && dd.node && dd.node._id === this._id) {
                dd.node.stopDrag();
            }
        }
    };

    Kinetic.Node.prototype._dragCleanup = function() {
        if (this.getClassName() === 'Stage') {
            this.off('contentMousedown.kinetic');
            this.off('contentTouchstart.kinetic');
        } else {
            this.off('mousedown.kinetic');
            this.off('touchstart.kinetic');
        }
    };

    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'dragBoundFunc');

    /**
     * get/set drag bound function.  This is used to override the default
     *  drag and drop position
     * @name dragBoundFunc
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Function} dragBoundFunc
     * @returns {Function}
     * @example
     * // get drag bound function
     * var dragBoundFunc = node.dragBoundFunc();
     *
     * // create vertical drag and drop
     * node.dragBoundFunc(function(){
     *   return {
     *     x: this.getAbsolutePosition().x,
     *     y: pos.y
     *   };
     * });
     */

    Kinetic.Factory.addGetter(Kinetic.Node, 'draggable', false);
    Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node, 'draggable');

     /**
     * get/set draggable flag
     * @name draggable
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Boolean} draggable
     * @returns {Boolean}
     * @example
     * // get draggable flag
     * var draggable = node.draggable();
     *
     * // enable drag and drop
     * node.draggable(true);
     *
     * // disable drag and drop
     * node.draggable(false);
     */

    var html = Kinetic.document.documentElement;
    html.addEventListener('mouseup', Kinetic.DD._endDragBefore, true);
    html.addEventListener('touchend', Kinetic.DD._endDragBefore, true);

    html.addEventListener('mouseup', Kinetic.DD._endDragAfter, false);
    html.addEventListener('touchend', Kinetic.DD._endDragAfter, false);

})();
;(function() {
    Kinetic.Util.addMethods(Kinetic.Container, {
        __init: function(config) {
            this.children = new Kinetic.Collection();
            Kinetic.Node.call(this, config);
        },
        /**
         * returns a {@link Kinetic.Collection} of direct descendant nodes
         * @method
         * @memberof Kinetic.Container.prototype
         * @param {Function} [filterFunc] filter function
         * @returns {Kinetic.Collection}
         * @example
         * // get all children
         * var children = layer.getChildren();
         *
         * // get only circles
         * var circles = layer.getChildren(function(node){
         *    return node.getClassName() === 'Circle';
         * });
         */
        getChildren: function(filterFunc) {
            if (!filterFunc) {
                return this.children;
            } else {
                var results = new Kinetic.Collection();
                this.children.each(function(child){
                    if (filterFunc(child)) {
                        results.push(child);
                    }
                });
                return results;
            }
        },
        /**
         * determine if node has children
         * @method
         * @memberof Kinetic.Container.prototype
         * @returns {Boolean}
         */
        hasChildren: function() {
            return this.getChildren().length > 0;
        },
        /**
         * remove all children
         * @method
         * @memberof Kinetic.Container.prototype
         */
        removeChildren: function() {
            var children = Kinetic.Collection.toCollection(this.children);
            var child;
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                // reset parent to prevent many _setChildrenIndices calls
                delete child.parent;
                child.index = 0;
                if (child.hasChildren()) {
                    child.removeChildren();
                }
                child.remove();
            }
            children = null;
            this.children = new Kinetic.Collection();
            return this;
        },
        /**
         * destroy all children
         * @method
         * @memberof Kinetic.Container.prototype
         */
        destroyChildren: function() {
           var children = Kinetic.Collection.toCollection(this.children);
            var child;
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                // reset parent to prevent many _setChildrenIndices calls
                delete child.parent;
                child.index = 0;
                child.destroy();
            }
            children = null;
            this.children = new Kinetic.Collection();
            return this;
        },
        /**
         * Add node or nodes to container.
         * @method
         * @memberof Kinetic.Container.prototype
         * @param {...Kinetic.Node} child
         * @returns {Container}
         * @example
         * layer.add(shape1, shape2, shape3);
         */
        add: function(child) {
            if (arguments.length > 1) {
                for (var i = 0; i < arguments.length; i++) {
                    this.add(arguments[i]);
                }
                return this;
            }
            if (child.getParent()) {
                child.moveTo(this);
                return this;
            }
            var children = this.children;
            this._validateAdd(child);
            child.index = children.length;
            child.parent = this;
            children.push(child);
            this._fire('add', {
                child: child
            });

            // chainable
            return this;
        },
        destroy: function() {
            // destroy children
            if (this.hasChildren()) {
                this.destroyChildren();
            }
            // then destroy self
            Kinetic.Node.prototype.destroy.call(this);
        },
        /**
         * return a {@link Kinetic.Collection} of nodes that match the selector.  Use '#' for id selections
         * and '.' for name selections.  You can also select by type or class name. Pass multiple selectors
         * separated by a space.
         * @method
         * @memberof Kinetic.Container.prototype
         * @param {String} selector
         * @returns {Collection}
         * @example
         * // select node with id foo
         * var node = stage.find('#foo');
         *
         * // select nodes with name bar inside layer
         * var nodes = layer.find('.bar');
         *
         * // select all groups inside layer
         * var nodes = layer.find('Group');
         *
         * // select all rectangles inside layer
         * var nodes = layer.find('Rect');
         *
         * // select node with an id of foo or a name of bar inside layer
         * var nodes = layer.find('#foo, .bar');
         */
        find: function(selector) {
            var retArr = [],
                selectorArr = selector.replace(/ /g, '').split(','),
                len = selectorArr.length,
                n, i, sel, arr, node, children, clen;

            for (n = 0; n < len; n++) {
                sel = selectorArr[n];

                // id selector
                if(sel.charAt(0) === '#') {
                    node = this._getNodeById(sel.slice(1));
                    if(node) {
                        retArr.push(node);
                    }
                }
                // name selector
                else if(sel.charAt(0) === '.') {
                    arr = this._getNodesByName(sel.slice(1));
                    retArr = retArr.concat(arr);
                }
                // unrecognized selector, pass to children
                else {
                    children = this.getChildren();
                    clen = children.length;
                    for(i = 0; i < clen; i++) {
                        retArr = retArr.concat(children[i]._get(sel));
                    }
                }
            }

            return Kinetic.Collection.toCollection(retArr);
        },
        _getNodeById: function(key) {
            var node = Kinetic.ids[key];

            if(node !== undefined && this.isAncestorOf(node)) {
                return node;
            }
            return null;
        },
        _getNodesByName: function(key) {
            var arr = Kinetic.names[key] || [];
            return this._getDescendants(arr);
        },
        _get: function(selector) {
            var retArr = Kinetic.Node.prototype._get.call(this, selector);
            var children = this.getChildren();
            var len = children.length;
            for(var n = 0; n < len; n++) {
                retArr = retArr.concat(children[n]._get(selector));
            }
            return retArr;
        },
        // extenders
        toObject: function() {
            var obj = Kinetic.Node.prototype.toObject.call(this);

            obj.children = [];

            var children = this.getChildren();
            var len = children.length;
            for(var n = 0; n < len; n++) {
                var child = children[n];
                obj.children.push(child.toObject());
            }

            return obj;
        },
        _getDescendants: function(arr) {
            var retArr = [];
            var len = arr.length;
            for(var n = 0; n < len; n++) {
                var node = arr[n];
                if(this.isAncestorOf(node)) {
                    retArr.push(node);
                }
            }

            return retArr;
        },
        /**
         * determine if node is an ancestor
         * of descendant
         * @method
         * @memberof Kinetic.Container.prototype
         * @param {Kinetic.Node} node
         */
        isAncestorOf: function(node) {
            var parent = node.getParent();
            while(parent) {
                if(parent._id === this._id) {
                    return true;
                }
                parent = parent.getParent();
            }

            return false;
        },
        clone: function(obj) {
            // call super method
            var node = Kinetic.Node.prototype.clone.call(this, obj);

            this.getChildren().each(function(no) {
                node.add(no.clone());
            });
            return node;
        },
        /**
         * get all shapes that intersect a point.  Note: because this method must clear a temporary
         * canvas and redraw every shape inside the container, it should only be used for special sitations
         * because it performs very poorly.  Please use the {@link Kinetic.Stage#getIntersection} method if at all possible
         * because it performs much better
         * @method
         * @memberof Kinetic.Container.prototype
         * @param {Object} pos
         * @param {Number} pos.x
         * @param {Number} pos.y
         * @returns {Array} array of shapes
         */
        getAllIntersections: function(pos) {
            var arr = [];

            this.find('Shape').each(function(shape) {
                if(shape.isVisible() && shape.intersects(pos)) {
                    arr.push(shape);
                }
            });

            return arr;
        },
        _setChildrenIndices: function() {
            this.children.each(function(child, n) {
                child.index = n;
            });
        },
        drawScene: function(can, top) {
            var layer = this.getLayer(),
                canvas = can || (layer && layer.getCanvas()),
                context = canvas && canvas.getContext(),
                cachedCanvas = this._cache.canvas,
                cachedSceneCanvas = cachedCanvas && cachedCanvas.scene;

            if (this.isVisible()) {
                if (cachedSceneCanvas) {
                    this._drawCachedSceneCanvas(context);
                }
                else {
                    this._drawChildren(canvas, 'drawScene', top);
                }
            }
            return this;
        },
        drawHit: function(can, top) {
            var layer = this.getLayer(),
                canvas = can || (layer && layer.hitCanvas),
                context = canvas && canvas.getContext(),
                cachedCanvas = this._cache.canvas,
                cachedHitCanvas = cachedCanvas && cachedCanvas.hit;

            if (this.shouldDrawHit(canvas)) {
                if (layer) {
                    layer.clearHitCache();
                }
                if (cachedHitCanvas) {
                    this._drawCachedHitCanvas(context);
                }
                else {
                    this._drawChildren(canvas, 'drawHit', top);
                }
            }
            return this;
        },
        _drawChildren: function(canvas, drawMethod, top) {
            var layer = this.getLayer(),
                context = canvas && canvas.getContext(),
                clipWidth = this.getClipWidth(),
                clipHeight = this.getClipHeight(),
                hasClip = clipWidth && clipHeight,
                clipX, clipY;

            if (hasClip && layer) {
                clipX = this.getClipX();
                clipY = this.getClipY();

                context.save();
                layer._applyTransform(this, context);
                context.beginPath();
                context.rect(clipX, clipY, clipWidth, clipHeight);
                context.clip();
                context.reset();
            }

            this.children.each(function(child) {
                child[drawMethod](canvas, top);
            });

            if (hasClip) {
                context.restore();
            }
        },
        shouldDrawHit: function(canvas) {
            var layer = this.getLayer();
            return  (canvas && canvas.isCache) || (layer && layer.hitGraphEnabled())
                && this.isVisible() && !Kinetic.isDragging();
        }
    });

    Kinetic.Util.extend(Kinetic.Container, Kinetic.Node);
    // deprecated methods
    Kinetic.Container.prototype.get = Kinetic.Container.prototype.find;

    // add getters setters
    Kinetic.Factory.addComponentsGetterSetter(Kinetic.Container, 'clip', ['x', 'y', 'width', 'height']);
    /**
     * get/set clip
     * @method
     * @name clip
     * @memberof Kinetic.Container.prototype
     * @param {Object} clip
     * @param {Number} clip.x
     * @param {Number} clip.y
     * @param {Number} clip.width
     * @param {Number} clip.height
     * @returns {Object}
     * @example
     * // get clip
     * var clip = container.clip();
     *
     * // set clip
     * container.setClip({
     *   x: 20,
     *   y: 20,
     *   width: 20,
     *   height: 20
     * });
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Container, 'clipX');
    /**
     * get/set clip x
     * @name clipX
     * @method
     * @memberof Kinetic.Container.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get clip x
     * var clipX = container.clipX();
     *
     * // set clip x
     * container.clipX(10);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Container, 'clipY');
    /**
     * get/set clip y
     * @name clipY
     * @method
     * @memberof Kinetic.Container.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get clip y
     * var clipY = container.clipY();
     *
     * // set clip y
     * container.clipY(10);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Container, 'clipWidth');
    /**
     * get/set clip width
     * @name clipWidth
     * @method
     * @memberof Kinetic.Container.prototype
     * @param {Number} width
     * @returns {Number}
     * @example
     * // get clip width
     * var clipWidth = container.clipWidth();
     *
     * // set clip width
     * container.clipWidth(100);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Container, 'clipHeight');
    /**
     * get/set clip height
     * @name clipHeight
     * @method
     * @memberof Kinetic.Container.prototype
     * @param {Number} height
     * @returns {Number}
     * @example
     * // get clip height
     * var clipHeight = container.clipHeight();
     *
     * // set clip height
     * container.clipHeight(100);
     */

    Kinetic.Collection.mapMethods(Kinetic.Container);
})();
;(function() {
    var HAS_SHADOW = 'hasShadow';

    function _fillFunc(context) {
        context.fill();
    }
    function _strokeFunc(context) {
        context.stroke();
    }
    function _fillFuncHit(context) {
        context.fill();
    }
    function _strokeFuncHit(context) {
        context.stroke();
    }

    function _clearHasShadowCache() {
        this._clearCache(HAS_SHADOW);
    }

    Kinetic.Util.addMethods(Kinetic.Shape, {
        __init: function(config) {
            this.nodeType = 'Shape';
            this._fillFunc = _fillFunc;
            this._strokeFunc = _strokeFunc;
            this._fillFuncHit = _fillFuncHit;
            this._strokeFuncHit = _strokeFuncHit;

            // set colorKey
            var shapes = Kinetic.shapes;
            var key;

            while(true) {
                key = Kinetic.Util.getRandomColor();
                if(key && !( key in shapes)) {
                    break;
                }
            }

            this.colorKey = key;
            shapes[key] = this;

            // call super constructor
            Kinetic.Node.call(this, config);

            this.on('shadowColorChange.kinetic shadowBlurChange.kinetic shadowOffsetChange.kinetic shadowOpacityChange.kinetic shadowEnabledChange.kinetic', _clearHasShadowCache);
        },
        hasChildren: function() {
            return false;
        },
        getChildren: function() {
            return [];
        },
        /**
         * get canvas context tied to the layer
         * @method
         * @memberof Kinetic.Shape.prototype
         * @returns {Kinetic.Context}
         */
        getContext: function() {
            return this.getLayer().getContext();
        },
        /**
         * get canvas renderer tied to the layer.  Note that this returns a canvas renderer, not a canvas element
         * @method
         * @memberof Kinetic.Shape.prototype
         * @returns {Kinetic.Canvas}
         */
        getCanvas: function() {
            return this.getLayer().getCanvas();
        },
        /**
         * returns whether or not a shadow will be rendered
         * @method
         * @memberof Kinetic.Shape.prototype
         * @returns {Boolean}
         */
        hasShadow: function() {
            return this._getCache(HAS_SHADOW, this._hasShadow);
        },
        _hasShadow: function() {
            return this.getShadowEnabled() && (this.getShadowOpacity() !== 0 && !!(this.getShadowColor() || this.getShadowBlur() || this.getShadowOffsetX() || this.getShadowOffsetY()));
        },
        /**
         * returns whether or not the shape will be filled
         * @method
         * @memberof Kinetic.Shape.prototype
         * @returns {Boolean}
         */
        hasFill: function() {
            return !!(this.getFill() || this.getFillPatternImage() || this.getFillLinearGradientColorStops() || this.getFillRadialGradientColorStops());
        },
        /**
         * returns whether or not the shape will be stroked
         * @method
         * @memberof Kinetic.Shape.prototype
         * @returns {Boolean}
         */
        hasStroke: function() {
            return !!(this.stroke() || this.strokeRed() || this.strokeGreen() || this.strokeBlue());
        },
        /**
         * determines if point is in the shape, regardless if other shapes are on top of it.  Note: because
         *  this method clears a temporary canvas and then redraws the shape, it performs very poorly if executed many times
         *  consecutively.  Please use the {@link Kinetic.Stage#getIntersection} method if at all possible
         *  because it performs much better
         * @method
         * @memberof Kinetic.Shape.prototype
         * @param {Object} point
         * @param {Number} point.x
         * @param {Number} point.y
         * @returns {Boolean}
         */
        intersects: function(point) {
            var stage = this.getStage(),
                bufferHitCanvas = stage.bufferHitCanvas,
                p;

            bufferHitCanvas.getContext().clear();
            this.drawScene(bufferHitCanvas);
            p = bufferHitCanvas.context.getImageData(Math.round(point.x), Math.round(point.y), 1, 1).data;
            return p[3] > 0;
        },
        // extends Node.prototype.destroy
        destroy: function() {
            Kinetic.Node.prototype.destroy.call(this);
            delete Kinetic.shapes[this.colorKey];
        },
        _useBufferCanvas: function() {
            return (this.hasShadow() || this.getAbsoluteOpacity() !== 1) && this.hasFill() && this.hasStroke() && this.getStage();
        },
        drawScene: function(can, top) {
            var layer = this.getLayer(),
                canvas = can || layer.getCanvas(),
                context = canvas.getContext(),
                cachedCanvas = this._cache.canvas,
                drawFunc = this.sceneFunc(),
                hasShadow = this.hasShadow(),
                stage, bufferCanvas, bufferContext;

            if(this.isVisible()) {
                if (cachedCanvas) {
                    this._drawCachedSceneCanvas(context);
                }
                else if (drawFunc) {
                    context.save();
                    // if buffer canvas is needed
                    if (this._useBufferCanvas()) {
                        stage = this.getStage();
                        bufferCanvas = stage.bufferCanvas;
                        bufferContext = bufferCanvas.getContext();
                        bufferContext.clear();
                        bufferContext.save();
                        bufferContext._applyLineJoin(this);
                        // layer might be undefined if we are using cache before adding to layer
                        if (layer) {
                            layer._applyTransform(this, bufferContext, top);
                        } else {
                            var m = this.getAbsoluteTransform(top).getMatrix();
                            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
                        }

                        drawFunc.call(this, bufferContext);
                        bufferContext.restore();

                        if (hasShadow && !canvas.hitCanvas) {
                            context.save();
                            context._applyShadow(this);
                            context.drawImage(bufferCanvas._canvas, 0, 0);
                            context.restore();
                        }

                        context._applyOpacity(this);
                        context.drawImage(bufferCanvas._canvas, 0, 0);
                    }
                    // if buffer canvas is not needed
                    else {
                        context._applyLineJoin(this);
                        // layer might be undefined if we are using cache before adding to layer
                        if (layer) {
                            layer._applyTransform(this, context, top);
                        } else {
                            var o = this.getAbsoluteTransform(top).getMatrix();
                            context.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
                        }

                        if (hasShadow && !canvas.hitCanvas) {
                            context.save();
                            context._applyShadow(this);
                            drawFunc.call(this, context);
                            context.restore();
                        }

                        context._applyOpacity(this);
                        drawFunc.call(this, context);
                    }
                    context.restore();
                }
            }

            return this;
        },
        drawHit: function(can, top) {
            var layer = this.getLayer(),
                canvas = can || layer.hitCanvas,
                context = canvas.getContext(),
                drawFunc = this.hitFunc() || this.sceneFunc(),
                cachedCanvas = this._cache.canvas,
                cachedHitCanvas = cachedCanvas && cachedCanvas.hit;

            if(this.shouldDrawHit(canvas)) {
                if (layer) {
                    layer.clearHitCache();
                }
                if (cachedHitCanvas) {
                    this._drawCachedHitCanvas(context);
                }
                else if (drawFunc) {
                    context.save();
                    context._applyLineJoin(this);
                    if (layer) {
                        layer._applyTransform(this, context, top);
                    } else {
                        var m = this.getAbsoluteTransform(top).getMatrix();
                        context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
                    }

                    drawFunc.call(this, context);
                    context.restore();
                }

            }

            return this;
        },
        /**
        * draw hit graph using the cached scene canvas
        * @method
        * @memberof Kinetic.Shape.prototype
        * @param {Integer} alphaThreshold alpha channel threshold that determines whether or not
        *  a pixel should be drawn onto the hit graph.  Must be a value between 0 and 255.
        *  The default is 0
        * @returns {Kinetic.Shape}
        * @example
        * shape.cache();
        * shape.drawHitFromCache();
        */
        drawHitFromCache: function(alphaThreshold) {
            var threshold = alphaThreshold || 0,
                cachedCanvas = this._cache.canvas,
                sceneCanvas = this._getCachedSceneCanvas(),
                sceneContext = sceneCanvas.getContext(),
                hitCanvas = cachedCanvas.hit,
                hitContext = hitCanvas.getContext(),
                width = sceneCanvas.getWidth(),
                height = sceneCanvas.getHeight(),
                sceneImageData, sceneData, hitImageData, hitData, len, rgbColorKey, i, alpha;

            hitContext.clear();

            try {
                sceneImageData = sceneContext.getImageData(0, 0, width, height);
                sceneData = sceneImageData.data;
                hitImageData = hitContext.getImageData(0, 0, width, height);
                hitData = hitImageData.data;
                len = sceneData.length;
                rgbColorKey = Kinetic.Util._hexToRgb(this.colorKey);

                // replace non transparent pixels with color key
                for(i = 0; i < len; i += 4) {
                    alpha = sceneData[i + 3];
                    if (alpha > threshold) {
                        hitData[i] = rgbColorKey.r;
                        hitData[i + 1] = rgbColorKey.g;
                        hitData[i + 2] = rgbColorKey.b;
                        hitData[i + 3] = 255;
                    }
                }

                hitContext.putImageData(hitImageData, 0, 0);
            }
            catch(e) {
                Kinetic.Util.warn('Unable to draw hit graph from cached scene canvas. ' + e.message);
            }

            return this;
        }
    });
    Kinetic.Util.extend(Kinetic.Shape, Kinetic.Node);

    // add getters and setters
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'stroke');

    /**
     * get/set stroke color
     * @name stroke
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {String} color
     * @returns {String}
     * @example
     * // get stroke color
     * var stroke = shape.stroke();
     *
     * // set stroke color with color string
     * shape.stroke('green');
     *
     * // set stroke color with hex
     * shape.stroke('#00ff00');
     *
     * // set stroke color with rgb
     * shape.stroke('rgb(0,255,0)');
     *
     * // set stroke color with rgba and make it 50% opaque
     * shape.stroke('rgba(0,255,0,0.5');
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'strokeRed', 0, Kinetic.Validators.RGBComponent);

    /**
     * get/set stroke red component
     * @name strokeRed
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Integer} red
     * @returns {Integer}
     * @example
     * // get stroke red component
     * var strokeRed = shape.strokeRed();
     *
     * // set stroke red component
     * shape.strokeRed(0);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'strokeGreen', 0, Kinetic.Validators.RGBComponent);

    /**
     * get/set stroke green component
     * @name strokeGreen
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Integer} green
     * @returns {Integer}
     * @example
     * // get stroke green component
     * var strokeGreen = shape.strokeGreen();
     *
     * // set stroke green component
     * shape.strokeGreen(255);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'strokeBlue', 0, Kinetic.Validators.RGBComponent);

    /**
     * get/set stroke blue component
     * @name strokeBlue
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Integer} blue
     * @returns {Integer}
     * @example
     * // get stroke blue component
     * var strokeBlue = shape.strokeBlue();
     *
     * // set stroke blue component
     * shape.strokeBlue(0);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'strokeAlpha', 1, Kinetic.Validators.alphaComponent);

    /**
     * get/set stroke alpha component.  Alpha is a real number between 0 and 1.  The default
     *  is 1.
     * @name strokeAlpha
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} alpha
     * @returns {Number}
     * @example
     * // get stroke alpha component
     * var strokeAlpha = shape.strokeAlpha();
     *
     * // set stroke alpha component
     * shape.strokeAlpha(0.5);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'strokeWidth', 2);

    /**
     * get/set stroke width
     * @name strokeWidth
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} strokeWidth
     * @returns {Number}
     * @example
     * // get stroke width
     * var strokeWidth = shape.strokeWidth();
     *
     * // set stroke width
     * shape.strokeWidth();
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'lineJoin');

    /**
     * get/set line join.  Can be miter, round, or bevel.  The
     *  default is miter
     * @name lineJoin
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {String} lineJoin
     * @returns {String}
     * @example
     * // get line join
     * var lineJoin = shape.lineJoin();
     *
     * // set line join
     * shape.lineJoin('round');
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'lineCap');

    /**
     * get/set line cap.  Can be butt, round, or square
     * @name lineCap
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {String} lineCap
     * @returns {String}
     * @example
     * // get line cap
     * var lineCap = shape.lineCap();
     *
     * // set line cap
     * shape.lineCap('round');
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'sceneFunc');

    /**
     * get/set scene draw function
     * @name sceneFunc
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Function} drawFunc drawing function
     * @returns {Function}
     * @example
     * // get scene draw function
     * var sceneFunc = shape.sceneFunc();
     *
     * // set scene draw function
     * shape.sceneFunc(function(context) {
     *   context.beginPath();
     *   context.rect(0, 0, this.width(), this.height());
     *   context.closePath();
     *   context.fillStrokeShape(this);
     * });
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'hitFunc');

    /**
     * get/set hit draw function
     * @name hitFunc
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Function} drawFunc drawing function
     * @returns {Function}
     * @example
     * // get hit draw function
     * var hitFunc = shape.hitFunc();
     *
     * // set hit draw function
     * shape.hitFunc(function(context) {
     *   context.beginPath();
     *   context.rect(0, 0, this.width(), this.height());
     *   context.closePath();
     *   context.fillStrokeShape(this);
     * });
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'dash');

    /**
     * get/set dash array for stroke.
     * @name dash
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Array} dash
     * @returns {Array}
     * @example
     *  // apply dashed stroke that is 10px long and 5 pixels apart
     *  line.dash([10, 5]);
     *
     *  // apply dashed stroke that is made up of alternating dashed
     *  // lines that are 10px long and 20px apart, and dots that have
     *  // a radius of 5px and are 20px apart
     *  line.dash([10, 20, 0.001, 20]);
     */


    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'shadowColor');

    /**
     * get/set shadow color
     * @name shadowColor
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {String} color
     * @returns {String}
     * @example
     * // get shadow color
     * var shadow = shape.shadowColor();
     *
     * // set shadow color with color string
     * shape.shadowColor('green');
     *
     * // set shadow color with hex
     * shape.shadowColor('#00ff00');
     *
     * // set shadow color with rgb
     * shape.shadowColor('rgb(0,255,0)');
     *
     * // set shadow color with rgba and make it 50% opaque
     * shape.shadowColor('rgba(0,255,0,0.5');
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'shadowRed', 0, Kinetic.Validators.RGBComponent);

    /**
     * get/set shadow red component
     * @name shadowRed
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Integer} red
     * @returns {Integer}
     * @example
     * // get shadow red component
     * var shadowRed = shape.shadowRed();
     *
     * // set shadow red component
     * shape.shadowRed(0);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'shadowGreen', 0, Kinetic.Validators.RGBComponent);

    /**
     * get/set shadow green component
     * @name shadowGreen
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Integer} green
     * @returns {Integer}
     * @example
     * // get shadow green component
     * var shadowGreen = shape.shadowGreen();
     *
     * // set shadow green component
     * shape.shadowGreen(255);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'shadowBlue', 0, Kinetic.Validators.RGBComponent);

    /**
     * get/set shadow blue component
     * @name shadowBlue
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Integer} blue
     * @returns {Integer}
     * @example
     * // get shadow blue component
     * var shadowBlue = shape.shadowBlue();
     *
     * // set shadow blue component
     * shape.shadowBlue(0);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'shadowAlpha', 1, Kinetic.Validators.alphaComponent);

    /**
     * get/set shadow alpha component.  Alpha is a real number between 0 and 1.  The default
     *  is 1.
     * @name shadowAlpha
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} alpha
     * @returns {Number}
     * @example
     * // get shadow alpha component
     * var shadowAlpha = shape.shadowAlpha();
     *
     * // set shadow alpha component
     * shape.shadowAlpha(0.5);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'shadowBlur');

    /**
     * get/set shadow blur
     * @name shadowBlur
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} blur
     * @returns {Number}
     * @example
     * // get shadow blur
     * var shadowBlur = shape.shadowBlur();
     *
     * // set shadow blur
     * shape.shadowBlur(10);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'shadowOpacity');

    /**
     * get/set shadow opacity.  must be a value between 0 and 1
     * @name shadowOpacity
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} opacity
     * @returns {Number}
     * @example
     * // get shadow opacity
     * var shadowOpacity = shape.shadowOpacity();
     *
     * // set shadow opacity
     * shape.shadowOpacity(0.5);
     */

    Kinetic.Factory.addComponentsGetterSetter(Kinetic.Shape, 'shadowOffset', ['x', 'y']);

    /**
     * get/set shadow offset
     * @name shadowOffset
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Object} offset
     * @param {Number} offset.x
     * @param {Number} offset.y
     * @returns {Object}
     * @example
     * // get shadow offset
     * var shadowOffset = shape.shadowOffset();
     *
     * // set shadow offset
     * shape.shadowOffset({
     *   x: 20
     *   y: 10
     * });
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'shadowOffsetX', 0);

     /**
     * get/set shadow offset x
     * @name shadowOffsetX
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get shadow offset x
     * var shadowOffsetX = shape.shadowOffsetX();
     *
     * // set shadow offset x
     * shape.shadowOffsetX(5);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'shadowOffsetY', 0);

     /**
     * get/set shadow offset y
     * @name shadowOffsetY
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get shadow offset y
     * var shadowOffsetY = shape.shadowOffsetY();
     *
     * // set shadow offset y
     * shape.shadowOffsetY(5);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillPatternImage');

    /**
     * get/set fill pattern image
     * @name fillPatternImage
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Image} image object
     * @returns {Image}
     * @example
     * // get fill pattern image
     * var fillPatternImage = shape.fillPatternImage();
     *
     * // set fill pattern image
     * var imageObj = new Image();
     * imageObj.onload = function() {
     *   shape.fillPatternImage(imageObj);
     * };
     * imageObj.src = 'path/to/image/jpg';
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fill');

    /**
     * get/set fill color
     * @name fill
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {String} color
     * @returns {String}
     * @example
     * // get fill color
     * var fill = shape.fill();
     *
     * // set fill color with color string
     * shape.fill('green');
     *
     * // set fill color with hex
     * shape.fill('#00ff00');
     *
     * // set fill color with rgb
     * shape.fill('rgb(0,255,0)');
     *
     * // set fill color with rgba and make it 50% opaque
     * shape.fill('rgba(0,255,0,0.5');
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillRed', 0, Kinetic.Validators.RGBComponent);

    /**
     * get/set fill red component
     * @name fillRed
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Integer} red
     * @returns {Integer}
     * @example
     * // get fill red component
     * var fillRed = shape.fillRed();
     *
     * // set fill red component
     * shape.fillRed(0);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillGreen', 0, Kinetic.Validators.RGBComponent);

    /**
     * get/set fill green component
     * @name fillGreen
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Integer} green
     * @returns {Integer}
     * @example
     * // get fill green component
     * var fillGreen = shape.fillGreen();
     *
     * // set fill green component
     * shape.fillGreen(255);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillBlue', 0, Kinetic.Validators.RGBComponent);

    /**
     * get/set fill blue component
     * @name fillBlue
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Integer} blue
     * @returns {Integer}
     * @example
     * // get fill blue component
     * var fillBlue = shape.fillBlue();
     *
     * // set fill blue component
     * shape.fillBlue(0);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillAlpha', 1, Kinetic.Validators.alphaComponent);

    /**
     * get/set fill alpha component.  Alpha is a real number between 0 and 1.  The default
     *  is 1.
     * @name fillAlpha
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} alpha
     * @returns {Number}
     * @example
     * // get fill alpha component
     * var fillAlpha = shape.fillAlpha();
     *
     * // set fill alpha component
     * shape.fillAlpha(0.5);
     */


    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillPatternX', 0);

    /**
     * get/set fill pattern x
     * @name fillPatternX
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get fill pattern x
     * var fillPatternX = shape.fillPatternX();
     *
     * // set fill pattern x
     * shape.fillPatternX(20);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillPatternY', 0);

    /**
     * get/set fill pattern y
     * @name fillPatternY
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get fill pattern y
     * var fillPatternY = shape.fillPatternY();
     *
     * // set fill pattern y
     * shape.fillPatternY(20);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillLinearGradientColorStops');

    /**
     * get/set fill linear gradient color stops
     * @name fillLinearGradientColorStops
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Array} colorStops
     * @returns {Array} colorStops
     * @example
     * // get fill linear gradient color stops
     * var colorStops = shape.fillLinearGradientColorStops();
     *
     * // create a linear gradient that starts with red, changes to blue
     * // halfway through, and then changes to green
     * shape.fillLinearGradientColorStops(0, 'red', 0.5, 'blue', 1, 'green');
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillRadialGradientStartRadius', 0);

    /**
     * get/set fill radial gradient start radius
     * @name fillRadialGradientStartRadius
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} radius
     * @returns {Number}
     * @example
     * // get radial gradient start radius
     * var startRadius = shape.fillRadialGradientStartRadius();
     *
     * // set radial gradient start radius
     * shape.fillRadialGradientStartRadius(0);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillRadialGradientEndRadius', 0);

    /**
     * get/set fill radial gradient end radius
     * @name fillRadialGradientEndRadius
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} radius
     * @returns {Number}
     * @example
     * // get radial gradient end radius
     * var endRadius = shape.fillRadialGradientEndRadius();
     *
     * // set radial gradient end radius
     * shape.fillRadialGradientEndRadius(100);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillRadialGradientColorStops');

    /**
     * get/set fill radial gradient color stops
     * @name fillRadialGradientColorStops
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} colorStops
     * @returns {Array}
     * @example
     * // get fill radial gradient color stops
     * var colorStops = shape.fillRadialGradientColorStops();
     *
     * // create a radial gradient that starts with red, changes to blue
     * // halfway through, and then changes to green
     * shape.fillRadialGradientColorStops(0, 'red', 0.5, 'blue', 1, 'green');
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillPatternRepeat', 'repeat');

    /**
     * get/set fill pattern repeat.  Can be 'repeat', 'repeat-x', 'repeat-y', or 'no-repeat'.  The default is 'repeat'
     * @name fillPatternRepeat
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {String} repeat
     * @returns {String}
     * @example
     * // get fill pattern repeat
     * var repeat = shape.fillPatternRepeat();
     *
     * // repeat pattern in x direction only
     * shape.fillPatternRepeat('repeat-x');
     *
     * // do not repeat the pattern
     * shape.fillPatternRepeat('no repeat');
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillEnabled', true);

    /**
     * get/set fill enabled flag
     * @name fillEnabled
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Boolean} enabled
     * @returns {Boolean}
     * @example
     * // get fill enabled flag
     * var fillEnabled = shape.fillEnabled();
     *
     * // disable fill
     * shape.fillEnabled(false);
     *
     * // enable fill
     * shape.fillEnabled(true);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'strokeEnabled', true);

    /**
     * get/set stroke enabled flag
     * @name strokeEnabled
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Boolean} enabled
     * @returns {Boolean}
     * @example
     * // get stroke enabled flag
     * var strokeEnabled = shape.strokeEnabled();
     *
     * // disable stroke
     * shape.strokeEnabled(false);
     *
     * // enable stroke
     * shape.strokeEnabled(true);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'shadowEnabled', true);

    /**
     * get/set shadow enabled flag
     * @name shadowEnabled
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Boolean} enabled
     * @returns {Boolean}
     * @example
     * // get shadow enabled flag
     * var shadowEnabled = shape.shadowEnabled();
     *
     * // disable shadow
     * shape.shadowEnabled(false);
     *
     * // enable shadow
     * shape.shadowEnabled(true);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'dashEnabled', true);

    /**
     * get/set dash enabled flag
     * @name dashEnabled
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Boolean} enabled
     * @returns {Boolean}
     * @example
     * // get dash enabled flag
     * var dashEnabled = shape.dashEnabled();
     *
     * // disable dash
     * shape.dashEnabled(false);
     *
     * // enable dash
     * shape.dashEnabled(true);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'strokeScaleEnabled', true);

    /**
     * get/set strokeScale enabled flag
     * @name strokeScaleEnabled
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Boolean} enabled
     * @returns {Boolean}
     * @example
     * // get stroke scale enabled flag
     * var strokeScaleEnabled = shape.strokeScaleEnabled();
     *
     * // disable stroke scale
     * shape.strokeScaleEnabled(false);
     *
     * // enable stroke scale
     * shape.strokeScaleEnabled(true);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillPriority', 'color');

    /**
     * get/set fill priority.  can be color, pattern, linear-gradient, or radial-gradient.  The default is color.
     *   This is handy if you want to toggle between different fill types.
     * @name fillPriority
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {String} priority
     * @returns {String}
     * @example
     * // get fill priority
     * var fillPriority = shape.fillPriority();
     *
     * // set fill priority
     * shape.fillPriority('linear-gradient');
     */

    Kinetic.Factory.addComponentsGetterSetter(Kinetic.Shape, 'fillPatternOffset', ['x', 'y']);

    /**
     * get/set fill pattern offset
     * @name fillPatternOffset
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Object} offset
     * @param {Number} offset.x
     * @param {Number} offset.y
     * @returns {Object}
     * @example
     * // get fill pattern offset
     * var patternOffset = shape.fillPatternOffset();
     *
     * // set fill pattern offset
     * shape.fillPatternOffset({
     *   x: 20
     *   y: 10
     * });
     */


    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillPatternOffsetX', 0);
    /**
     * get/set fill pattern offset x
     * @name fillPatternOffsetX
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get fill pattern offset x
     * var patternOffsetX = shape.fillPatternOffsetX();
     *
     * // set fill pattern offset x
     * shape.fillPatternOffsetX(20);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillPatternOffsetY', 0);
    /**
     * get/set fill pattern offset y
     * @name fillPatternOffsetY
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get fill pattern offset y
     * var patternOffsetY = shape.fillPatternOffsetY();
     *
     * // set fill pattern offset y
     * shape.fillPatternOffsetY(10);
     */

    Kinetic.Factory.addComponentsGetterSetter(Kinetic.Shape, 'fillPatternScale', ['x', 'y']);

    /**
     * get/set fill pattern scale
     * @name fillPatternScale
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Object} scale
     * @param {Number} scale.x
     * @param {Number} scale.y
     * @returns {Object}
     * @example
     * // get fill pattern scale
     * var patternScale = shape.fillPatternScale();
     *
     * // set fill pattern scale
     * shape.fillPatternScale({
     *   x: 2
     *   y: 2
     * });
     */


    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillPatternScaleX', 1);
    /**
     * get/set fill pattern scale x
     * @name fillPatternScaleX
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get fill pattern scale x
     * var patternScaleX = shape.fillPatternScaleX();
     *
     * // set fill pattern scale x
     * shape.fillPatternScaleX(2);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillPatternScaleY', 1);
    /**
     * get/set fill pattern scale y
     * @name fillPatternScaleY
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get fill pattern scale y
     * var patternScaleY = shape.fillPatternScaleY();
     *
     * // set fill pattern scale y
     * shape.fillPatternScaleY(2);
     */

    Kinetic.Factory.addComponentsGetterSetter(Kinetic.Shape, 'fillLinearGradientStartPoint', ['x', 'y']);

    /**
     * get/set fill linear gradient start point
     * @name fillLinearGradientStartPoint
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Object} startPoint
     * @param {Number} startPoint.x
     * @param {Number} startPoint.y
     * @returns {Object}
     * @example
     * // get fill linear gradient start point
     * var startPoint = shape.fillLinearGradientStartPoint();
     *
     * // set fill linear gradient start point
     * shape.fillLinearGradientStartPoint({
     *   x: 20
     *   y: 10
     * });
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillLinearGradientStartPointX', 0);
    /**
     * get/set fill linear gradient start point x
     * @name fillLinearGradientStartPointX
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get fill linear gradient start point x
     * var startPointX = shape.fillLinearGradientStartPointX();
     *
     * // set fill linear gradient start point x
     * shape.fillLinearGradientStartPointX(20);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillLinearGradientStartPointY', 0);
    /**
     * get/set fill linear gradient start point y
     * @name fillLinearGradientStartPointY
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get fill linear gradient start point y
     * var startPointY = shape.fillLinearGradientStartPointY();
     *
     * // set fill linear gradient start point y
     * shape.fillLinearGradientStartPointY(20);
     */

    Kinetic.Factory.addComponentsGetterSetter(Kinetic.Shape, 'fillLinearGradientEndPoint', ['x', 'y']);

    /**
     * get/set fill linear gradient end point
     * @name fillLinearGradientEndPoint
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Object} endPoint
     * @param {Number} endPoint.x
     * @param {Number} endPoint.y
     * @returns {Object}
     * @example
     * // get fill linear gradient end point
     * var endPoint = shape.fillLinearGradientEndPoint();
     *
     * // set fill linear gradient end point
     * shape.fillLinearGradientEndPoint({
     *   x: 20
     *   y: 10
     * });
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillLinearGradientEndPointX', 0);
    /**
     * get/set fill linear gradient end point x
     * @name fillLinearGradientEndPointX
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get fill linear gradient end point x
     * var endPointX = shape.fillLinearGradientEndPointX();
     *
     * // set fill linear gradient end point x
     * shape.fillLinearGradientEndPointX(20);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillLinearGradientEndPointY', 0);
    /**
     * get/set fill linear gradient end point y
     * @name fillLinearGradientEndPointY
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get fill linear gradient end point y
     * var endPointY = shape.fillLinearGradientEndPointY();
     *
     * // set fill linear gradient end point y
     * shape.fillLinearGradientEndPointY(20);
     */

    Kinetic.Factory.addComponentsGetterSetter(Kinetic.Shape, 'fillRadialGradientStartPoint', ['x', 'y']);

    /**
     * get/set fill radial gradient start point
     * @name fillRadialGradientStartPoint
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Object} startPoint
     * @param {Number} startPoint.x
     * @param {Number} startPoint.y
     * @returns {Object}
     * @example
     * // get fill radial gradient start point
     * var startPoint = shape.fillRadialGradientStartPoint();
     *
     * // set fill radial gradient start point
     * shape.fillRadialGradientStartPoint({
     *   x: 20
     *   y: 10
     * });
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillRadialGradientStartPointX', 0);
    /**
     * get/set fill radial gradient start point x
     * @name fillRadialGradientStartPointX
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get fill radial gradient start point x
     * var startPointX = shape.fillRadialGradientStartPointX();
     *
     * // set fill radial gradient start point x
     * shape.fillRadialGradientStartPointX(20);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillRadialGradientStartPointY', 0);
    /**
     * get/set fill radial gradient start point y
     * @name fillRadialGradientStartPointY
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get fill radial gradient start point y
     * var startPointY = shape.fillRadialGradientStartPointY();
     *
     * // set fill radial gradient start point y
     * shape.fillRadialGradientStartPointY(20);
     */

    Kinetic.Factory.addComponentsGetterSetter(Kinetic.Shape, 'fillRadialGradientEndPoint', ['x', 'y']);

    /**
     * get/set fill radial gradient end point
     * @name fillRadialGradientEndPoint
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Object} endPoint
     * @param {Number} endPoint.x
     * @param {Number} endPoint.y
     * @returns {Object}
     * @example
     * // get fill radial gradient end point
     * var endPoint = shape.fillRadialGradientEndPoint();
     *
     * // set fill radial gradient end point
     * shape.fillRadialGradientEndPoint({
     *   x: 20
     *   y: 10
     * });
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillRadialGradientEndPointX', 0);
    /**
     * get/set fill radial gradient end point x
     * @name fillRadialGradientEndPointX
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get fill radial gradient end point x
     * var endPointX = shape.fillRadialGradientEndPointX();
     *
     * // set fill radial gradient end point x
     * shape.fillRadialGradientEndPointX(20);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillRadialGradientEndPointY', 0);
    /**
     * get/set fill radial gradient end point y
     * @name fillRadialGradientEndPointY
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get fill radial gradient end point y
     * var endPointY = shape.fillRadialGradientEndPointY();
     *
     * // set fill radial gradient end point y
     * shape.fillRadialGradientEndPointY(20);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillPatternRotation', 0);

    /**
     * get/set fill pattern rotation in degrees
     * @name fillPatternRotation
     * @method
     * @memberof Kinetic.Shape.prototype
     * @param {Number} rotation
     * @returns {Kinetic.Shape}
     * @example
     * // get fill pattern rotation
     * var patternRotation = shape.fillPatternRotation();
     *
     * // set fill pattern rotation
     * shape.fillPatternRotation(20);
     */


    Kinetic.Factory.backCompat(Kinetic.Shape, {
        dashArray: 'dash',
        getDashArray: 'getDash',
        setDashArray: 'getDash',

        drawFunc: 'sceneFunc',
        getDrawFunc: 'getSceneFunc',
        setDrawFunc: 'setSceneFunc',

        drawHitFunc: 'hitFunc',
        getDrawHitFunc: 'getHitFunc',
        setDrawHitFunc: 'setHitFunc'
    });

    Kinetic.Collection.mapMethods(Kinetic.Shape);
})();
;/*jshint unused:false */
(function() {
    // CONSTANTS
    var STAGE = 'Stage',
        STRING = 'string',
        PX = 'px',

        MOUSEOUT = 'mouseout',
        MOUSELEAVE = 'mouseleave',
        MOUSEOVER = 'mouseover',
        MOUSEENTER = 'mouseenter',
        MOUSEMOVE = 'mousemove',
        MOUSEDOWN = 'mousedown',
        MOUSEUP = 'mouseup',
        CLICK = 'click',
        DBL_CLICK = 'dblclick',
        TOUCHSTART = 'touchstart',
        TOUCHEND = 'touchend',
        TAP = 'tap',
        DBL_TAP = 'dbltap',
        TOUCHMOVE = 'touchmove',
        DOMMOUSESCROLL = 'DOMMouseScroll',
        MOUSEWHEEL = 'mousewheel',
        WHEEL = 'wheel',

        CONTENT_MOUSEOUT = 'contentMouseout',
        CONTENT_MOUSEOVER = 'contentMouseover',
        CONTENT_MOUSEMOVE = 'contentMousemove',
        CONTENT_MOUSEDOWN = 'contentMousedown',
        CONTENT_MOUSEUP = 'contentMouseup',
        CONTENT_CLICK = 'contentClick',
        CONTENT_DBL_CLICK = 'contentDblclick',
        CONTENT_TOUCHSTART = 'contentTouchstart',
        CONTENT_TOUCHEND = 'contentTouchend',
        CONTENT_DBL_TAP = 'contentDbltap',
        CONTENT_TOUCHMOVE = 'contentTouchmove',

        DIV = 'div',
        RELATIVE = 'relative',
        INLINE_BLOCK = 'inline-block',
        KINETICJS_CONTENT = 'kineticjs-content',
        SPACE = ' ',
        UNDERSCORE = '_',
        CONTAINER = 'container',
        EMPTY_STRING = '',
        EVENTS = [MOUSEDOWN, MOUSEMOVE, MOUSEUP, MOUSEOUT, TOUCHSTART, TOUCHMOVE, TOUCHEND, MOUSEOVER, DOMMOUSESCROLL, MOUSEWHEEL, WHEEL],

        // cached variables
        eventsLength = EVENTS.length;

    function addEvent(ctx, eventName) {
        ctx.content.addEventListener(eventName, function(evt) {
            ctx[UNDERSCORE + eventName](evt);
        }, false);
    }

    Kinetic.Util.addMethods(Kinetic.Stage, {
        ___init: function(config) {
            this.nodeType = STAGE;
            // call super constructor
            Kinetic.Container.call(this, config);
            this._id = Kinetic.idCounter++;
            this._buildDOM();
            this._bindContentEvents();
            this._enableNestedTransforms = false;
            Kinetic.stages.push(this);
        },
        _validateAdd: function(child) {
            if (child.getType() !== 'Layer') {
                Kinetic.Util.error('You may only add layers to the stage.');
            }
        },
        /**
         * set container dom element which contains the stage wrapper div element
         * @method
         * @memberof Kinetic.Stage.prototype
         * @param {DomElement} container can pass in a dom element or id string
         */
        setContainer: function(container) {
            if( typeof container === STRING) {
                var id = container;
                container = Kinetic.document.getElementById(container);
                if (!container) {
                    throw 'Can not find container in document with id ' + id;
                }
            }
            this._setAttr(CONTAINER, container);
            return this;
        },
        shouldDrawHit: function() {
            return true;
        },
        draw: function() {
            Kinetic.Node.prototype.draw.call(this);
            return this;
        },
        /**
         * draw layer scene graphs
         * @name draw
         * @method
         * @memberof Kinetic.Stage.prototype
         */

        /**
         * draw layer hit graphs
         * @name drawHit
         * @method
         * @memberof Kinetic.Stage.prototype
         */

        /**
         * set height
         * @method
         * @memberof Kinetic.Stage.prototype
         * @param {Number} height
         */
        setHeight: function(height) {
            Kinetic.Node.prototype.setHeight.call(this, height);
            this._resizeDOM();
            return this;
        },
        /**
         * set width
         * @method
         * @memberof Kinetic.Stage.prototype
         * @param {Number} width
         */
        setWidth: function(width) {
            Kinetic.Node.prototype.setWidth.call(this, width);
            this._resizeDOM();
            return this;
        },
        /**
         * clear all layers
         * @method
         * @memberof Kinetic.Stage.prototype
         */
        clear: function() {
            var layers = this.children,
                len = layers.length,
                n;

            for(n = 0; n < len; n++) {
                layers[n].clear();
            }
            return this;
        },
        clone: function(obj) {
            if (!obj) {
                obj = {};
            }
            obj.container = Kinetic.document.createElement(DIV);

            return Kinetic.Container.prototype.clone.call(this, obj);
        },
        /**
         * destroy stage
         * @method
         * @memberof Kinetic.Stage.prototype
         */
        destroy: function() {
            var content = this.content;
            Kinetic.Container.prototype.destroy.call(this);

            if(content && Kinetic.Util._isInDocument(content)) {
                this.getContainer().removeChild(content);
            }
            var index = Kinetic.stages.indexOf(this);
            if (index > -1) {
                Kinetic.stages.splice(index, 1);
            }
        },
        /**
         * get pointer position which can be a touch position or mouse position
         * @method
         * @memberof Kinetic.Stage.prototype
         * @returns {Object}
         */
        getPointerPosition: function() {
            return this.pointerPos;
        },
        getStage: function() {
            return this;
        },
        /**
         * get stage content div element which has the
         *  the class name "kineticjs-content"
         * @method
         * @memberof Kinetic.Stage.prototype
         */
        getContent: function() {
            return this.content;
        },
        /**
         * Creates a composite data URL and requires a callback because the composite is generated asynchronously.
         * @method
         * @memberof Kinetic.Stage.prototype
         * @param {Object} config
         * @param {Function} config.callback function executed when the composite has completed
         * @param {String} [config.mimeType] can be "image/png" or "image/jpeg".
         *  "image/png" is the default
         * @param {Number} [config.x] x position of canvas section
         * @param {Number} [config.y] y position of canvas section
         * @param {Number} [config.width] width of canvas section
         * @param {Number} [config.height] height of canvas section
         * @param {Number} [config.quality] jpeg quality.  If using an "image/jpeg" mimeType,
         *  you can specify the quality from 0 to 1, where 0 is very poor quality and 1
         *  is very high quality
         */
        toDataURL: function(config) {
            config = config || {};

            var mimeType = config.mimeType || null,
                quality = config.quality || null,
                x = config.x || 0,
                y = config.y || 0,
                canvas = new Kinetic.SceneCanvas({
                    width: config.width || this.getWidth(),
                    height: config.height || this.getHeight(),
                    pixelRatio: 1
                }),
                _context = canvas.getContext()._context,
                layers = this.children;

            if(x || y) {
                _context.translate(-1 * x, -1 * y);
            }

            function drawLayer(n) {
                var layer = layers[n],
                    layerUrl = layer.toDataURL(),
                    imageObj = new Kinetic.window.Image();

                imageObj.onload = function() {
                    _context.drawImage(imageObj, 0, 0);

                    if(n < layers.length - 1) {
                        drawLayer(n + 1);
                    }
                    else {
                        config.callback(canvas.toDataURL(mimeType, quality));
                    }
                };
                imageObj.src = layerUrl;
            }
            drawLayer(0);
        },
        /**
         * converts stage into an image.
         * @method
         * @memberof Kinetic.Stage.prototype
         * @param {Object} config
         * @param {Function} config.callback function executed when the composite has completed
         * @param {String} [config.mimeType] can be "image/png" or "image/jpeg".
         *  "image/png" is the default
         * @param {Number} [config.x] x position of canvas section
         * @param {Number} [config.y] y position of canvas section
         * @param {Number} [config.width] width of canvas section
         * @param {Number} [config.height] height of canvas section
         * @param {Number} [config.quality] jpeg quality.  If using an "image/jpeg" mimeType,
         *  you can specify the quality from 0 to 1, where 0 is very poor quality and 1
         *  is very high quality
         */
        toImage: function(config) {
            var cb = config.callback;

            config.callback = function(dataUrl) {
                Kinetic.Util._getImage(dataUrl, function(img) {
                    cb(img);
                });
            };
            this.toDataURL(config);
        },
        /**
         * get visible intersection shape. This is the preferred
         *  method for determining if a point intersects a shape or not
         * @method
         * @memberof Kinetic.Stage.prototype
         * @param {Object} pos
         * @param {Number} pos.x
         * @param {Number} pos.y
         * @returns {Kinetic.Shape}
         */
        getIntersection: function(pos) {
            var layers = this.getChildren(),
                len = layers.length,
                end = len - 1,
                n, shape;

            for(n = end; n >= 0; n--) {
                shape = layers[n].getIntersection(pos);
                if (shape) {
                    return shape;
                }
            }

            return null;
        },
        _resizeDOM: function() {
            if(this.content) {
                var width = this.getWidth(),
                    height = this.getHeight(),
                    layers = this.getChildren(),
                    len = layers.length,
                    n, layer;

                // set content dimensions
                this.content.style.width = width + PX;
                this.content.style.height = height + PX;

                this.bufferCanvas.setSize(width, height);
                this.bufferHitCanvas.setSize(width, height);

                // set layer dimensions
                for(n = 0; n < len; n++) {
                    layer = layers[n];
                    layer.setSize(width, height);
                    layer.draw();
                }
            }
        },
        /**
         * add layer or layers to stage
         * @method
         * @memberof Kinetic.Stage.prototype
         * @param {...Kinetic.Layer} layer
         * @example
         * stage.add(layer1, layer2, layer3);
         */
        add: function(layer) {
            if (arguments.length > 1) {
                for (var i = 0; i < arguments.length; i++) {
                    this.add(arguments[i]);
                }
                return;
            }
            Kinetic.Container.prototype.add.call(this, layer);
            layer._setCanvasSize(this.width(), this.height());

            // draw layer and append canvas to container
            layer.draw();
            this.content.appendChild(layer.canvas._canvas);

            // chainable
            return this;
        },
        getParent: function() {
            return null;
        },
        getLayer: function() {
            return null;
        },
        /**
         * returns a {@link Kinetic.Collection} of layers
         * @method
         * @memberof Kinetic.Stage.prototype
         */
        getLayers: function() {
            return this.getChildren();
        },
        _bindContentEvents: function() {
            for (var n = 0; n < eventsLength; n++) {
                addEvent(this, EVENTS[n]);
            }
        },
        _mouseover: function(evt) {
            if (!Kinetic.UA.mobile) {
                this._setPointerPosition(evt);
                this._fire(CONTENT_MOUSEOVER, {evt: evt});
            }
        },
        _mouseout: function(evt) {
            if (!Kinetic.UA.mobile) {
                this._setPointerPosition(evt);
                var targetShape = this.targetShape;

                if(targetShape && !Kinetic.isDragging()) {
                    targetShape._fireAndBubble(MOUSEOUT, {evt: evt});
                    targetShape._fireAndBubble(MOUSELEAVE, {evt: evt});
                    this.targetShape = null;
                }
                this.pointerPos = undefined;

                this._fire(CONTENT_MOUSEOUT, {evt: evt});
            }
        },
        _mousemove: function(evt) {

            // workaround for mobile IE to force touch event when unhandled pointer event elevates into a mouse event
            if (Kinetic.UA.ieMobile) {
                return this._touchmove(evt);
            }

            // workaround fake mousemove event in chrome browser https://code.google.com/p/chromium/issues/detail?id=161464
            if ((typeof evt.webkitMovementX !== 'undefined' || typeof evt.webkitMovementY !== 'undefined') && evt.webkitMovementY === 0 && evt.webkitMovementX === 0) {
                return;
            }
            if (Kinetic.UA.mobile) {
                return;
            }
            this._setPointerPosition(evt);
            var dd = Kinetic.DD, shape;

            if (!Kinetic.isDragging()) {
                shape = this.getIntersection(this.getPointerPosition());
                if(shape && shape.isListening()) {
                    if(!Kinetic.isDragging() && (!this.targetShape || this.targetShape._id !== shape._id)) {
                        if(this.targetShape) {
                            this.targetShape._fireAndBubble(MOUSEOUT, {evt: evt}, shape);
                            this.targetShape._fireAndBubble(MOUSELEAVE, {evt: evt}, shape);
                        }
                        shape._fireAndBubble(MOUSEOVER, {evt: evt}, this.targetShape);
                        shape._fireAndBubble(MOUSEENTER, {evt: evt}, this.targetShape);
                        this.targetShape = shape;
                    }
                    else {
                        shape._fireAndBubble(MOUSEMOVE, {evt: evt});
                    }
                }
                /*
                 * if no shape was detected, clear target shape and try
                 * to run mouseout from previous target shape
                 */
                else {
                    if(this.targetShape && !Kinetic.isDragging()) {
                        this.targetShape._fireAndBubble(MOUSEOUT, {evt: evt});
                        this.targetShape._fireAndBubble(MOUSELEAVE, {evt: evt});
                        this.targetShape = null;
                    }

                }

                // content event
                this._fire(CONTENT_MOUSEMOVE, {evt: evt});
            }
            if(dd) {
                dd._drag(evt);
            }

            // always call preventDefault for desktop events because some browsers
            // try to drag and drop the canvas element
            if (evt.preventDefault) {
                evt.preventDefault();
            }
        },
        _mousedown: function(evt) {

            // workaround for mobile IE to force touch event when unhandled pointer event elevates into a mouse event
            if (Kinetic.UA.ieMobile) {
                return this._touchstart(evt);
            }

            if (!Kinetic.UA.mobile) {
                this._setPointerPosition(evt);
                var shape = this.getIntersection(this.getPointerPosition());

                Kinetic.listenClickTap = true;

                if (shape && shape.isListening()) {
                    this.clickStartShape = shape;
                    shape._fireAndBubble(MOUSEDOWN, {evt: evt});
                }

                // content event
                this._fire(CONTENT_MOUSEDOWN, {evt: evt});
            }

            // always call preventDefault for desktop events because some browsers
            // try to drag and drop the canvas element
            if (evt.preventDefault) {
                evt.preventDefault();
            }
        },
        _mouseup: function(evt) {

            // workaround for mobile IE to force touch event when unhandled pointer event elevates into a mouse event
            if (Kinetic.UA.ieMobile) {
                return this._touchend(evt);
            }
            if (!Kinetic.UA.mobile) {
                this._setPointerPosition(evt);
                var shape = this.getIntersection(this.getPointerPosition()),
                    clickStartShape = this.clickStartShape,
                    fireDblClick = false,
                    dd = Kinetic.DD;

                if(Kinetic.inDblClickWindow) {
                    fireDblClick = true;
                    Kinetic.inDblClickWindow = false;
                }
                // don't set inDblClickWindow after dragging
                else if (!dd || !dd.justDragged) {
                    Kinetic.inDblClickWindow = true;
                } else if (dd) {
                    dd.justDragged = false;
                }

                setTimeout(function() {
                    Kinetic.inDblClickWindow = false;
                }, Kinetic.dblClickWindow);

                if (shape && shape.isListening()) {
                    shape._fireAndBubble(MOUSEUP, {evt: evt});

                    // detect if click or double click occurred
                    if(Kinetic.listenClickTap && clickStartShape && clickStartShape._id === shape._id) {
                        shape._fireAndBubble(CLICK, {evt: evt});

                        if(fireDblClick) {
                            shape._fireAndBubble(DBL_CLICK, {evt: evt});
                        }
                    }
                }
                // content events
                this._fire(CONTENT_MOUSEUP, {evt: evt});
                if (Kinetic.listenClickTap) {
                    this._fire(CONTENT_CLICK, {evt: evt});
                    if(fireDblClick) {
                        this._fire(CONTENT_DBL_CLICK, {evt: evt});
                    }
                }

                Kinetic.listenClickTap = false;
            }

            // always call preventDefault for desktop events because some browsers
            // try to drag and drop the canvas element
            if (evt.preventDefault) {
                evt.preventDefault();
            }
        },
        _touchstart: function(evt) {
            this._setPointerPosition(evt);
            var shape = this.getIntersection(this.getPointerPosition());

            Kinetic.listenClickTap = true;

            if (shape && shape.isListening()) {
                this.tapStartShape = shape;
                shape._fireAndBubble(TOUCHSTART, {evt: evt});

                // only call preventDefault if the shape is listening for events
                if (shape.isListening() && evt.preventDefault) {
                    evt.preventDefault();
                }
            }
            // content event
            this._fire(CONTENT_TOUCHSTART, {evt: evt});
        },
        _touchend: function(evt) {
            this._setPointerPosition(evt);
            var shape = this.getIntersection(this.getPointerPosition()),
                fireDblClick = false;

            if(Kinetic.inDblClickWindow) {
                fireDblClick = true;
                Kinetic.inDblClickWindow = false;
            }
            else {
                Kinetic.inDblClickWindow = true;
            }

            setTimeout(function() {
                Kinetic.inDblClickWindow = false;
            }, Kinetic.dblClickWindow);

            if (shape && shape.isListening()) {
                shape._fireAndBubble(TOUCHEND, {evt: evt});

                // detect if tap or double tap occurred
                if(Kinetic.listenClickTap && shape._id === this.tapStartShape._id) {
                    shape._fireAndBubble(TAP, {evt: evt});

                    if(fireDblClick) {
                        shape._fireAndBubble(DBL_TAP, {evt: evt});
                    }
                }
                // only call preventDefault if the shape is listening for events
                if (shape.isListening() && evt.preventDefault) {
                    evt.preventDefault();
                }
            }
            // content events
            if (Kinetic.listenClickTap) {
                this._fire(CONTENT_TOUCHEND, {evt: evt});
                if(fireDblClick) {
                    this._fire(CONTENT_DBL_TAP, {evt: evt});
                }
            }

            Kinetic.listenClickTap = false;
        },
        _touchmove: function(evt) {
            this._setPointerPosition(evt);
            var dd = Kinetic.DD,
                shape;
            if (!Kinetic.isDragging()) {
                shape = this.getIntersection(this.getPointerPosition());
                if (shape && shape.isListening()) {
                    shape._fireAndBubble(TOUCHMOVE, {evt: evt});
                    // only call preventDefault if the shape is listening for events
                    if (shape.isListening() && evt.preventDefault) {
                        evt.preventDefault();
                    }
                }
                this._fire(CONTENT_TOUCHMOVE, {evt: evt});
            }
            if(dd) {
                dd._drag(evt);
                if (Kinetic.isDragging()) {
                    evt.preventDefault();
                }
            }
        },
        _DOMMouseScroll: function(evt) {
            this._mousewheel(evt);
        },
        _mousewheel: function(evt) {
            this._setPointerPosition(evt);
            var shape = this.getIntersection(this.getPointerPosition());

            if (shape && shape.isListening()) {
                shape._fireAndBubble(MOUSEWHEEL, {evt: evt});
            }
        },
        _wheel: function(evt) {
            this._mousewheel(evt);
        },
        _setPointerPosition: function(evt) {
            var contentPosition = this._getContentPosition(),
                offsetX = evt.offsetX,
                clientX = evt.clientX,
                x = null,
                y = null,
                touch;
            evt = evt ? evt : window.event;

            // touch events
            if(evt.touches !== undefined) {
                // currently, only handle one finger
                if (evt.touches.length > 0) {

                    touch = evt.touches[0];

                    // get the information for finger #1
                    x = touch.clientX - contentPosition.left;
                    y = touch.clientY - contentPosition.top;
                }
            }
            // mouse events
            else {
                // if offsetX is defined, assume that offsetY is defined as well
                if (offsetX !== undefined) {
                    x = offsetX;
                    y = evt.offsetY;
                }
                // we unfortunately have to use UA detection here because accessing
                // the layerX or layerY properties in newer versions of Chrome
                // throws a JS warning.  layerX and layerY are required for FF
                // when the container is transformed via CSS.
                else if (Kinetic.UA.browser === 'mozilla') {
                    x = evt.layerX;
                    y = evt.layerY;
                }
                // if clientX is defined, assume that clientY is defined as well
                else if (clientX !== undefined && contentPosition) {
                    x = clientX - contentPosition.left;
                    y = evt.clientY - contentPosition.top;
                }
            }

            if (x !== null && y !== null) {
                this.pointerPos = {
                    x: x,
                    y: y
                };
            }
        },
        _getContentPosition: function() {
            var rect = this.content.getBoundingClientRect ? this.content.getBoundingClientRect() : { top: 0, left: 0 };
            return {
                top: rect.top,
                left: rect.left
            };
        },
        _buildDOM: function() {
            var container = this.getContainer();
            if (!container) {
                if (Kinetic.Util.isBrowser()) {
                    throw 'Stage has no container. A container is required.';
                } else {
                    // automatically create element for jsdom in nodejs env
                    container = Kinetic.document.createElement(DIV);
                }
            }
            // clear content inside container
            container.innerHTML = EMPTY_STRING;

            // content
            this.content = Kinetic.document.createElement(DIV);
            this.content.style.position = RELATIVE;
            this.content.style.display = INLINE_BLOCK;
            this.content.className = KINETICJS_CONTENT;
            this.content.setAttribute('role', 'presentation');
            container.appendChild(this.content);

            // the buffer canvas pixel ratio must be 1 because it is used as an
            // intermediate canvas before copying the result onto a scene canvas.
            // not setting it to 1 will result in an over compensation
            this.bufferCanvas = new Kinetic.SceneCanvas({
                pixelRatio: 1
            });
            this.bufferHitCanvas = new Kinetic.HitCanvas();

            this._resizeDOM();
        },
        _onContent: function(typesStr, handler) {
            var types = typesStr.split(SPACE),
                len = types.length,
                n, baseEvent;

            for(n = 0; n < len; n++) {
                baseEvent = types[n];
                this.content.addEventListener(baseEvent, handler, false);
            }
        },
        // currently cache function is now working for stage, because stage has no its own canvas element
        // TODO: may be it is better to cache all children layers?
        cache: function() {
            Kinetic.Util.warn('Cache function is not allowed for stage. You may use cache only for layers, groups and shapes.');
        },
        clearCache : function() {
        }
    });
    Kinetic.Util.extend(Kinetic.Stage, Kinetic.Container);

    // add getters and setters
    Kinetic.Factory.addGetter(Kinetic.Stage, 'container');
    Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Stage, 'container');

    /**
     * get container DOM element
     * @name container
     * @method
     * @memberof Kinetic.Stage.prototype
     * @returns {DomElement} container
     * @example
     * // get container
     * var container = stage.container();
     *
     * // set container
     * var container = document.createElement('div');
     * body.appendChild(container);
     * stage.container(container);
     */

})();
;(function() {
    Kinetic.Util.addMethods(Kinetic.BaseLayer, {
        ___init: function(config) {
            this.nodeType = 'Layer';
            Kinetic.Container.call(this, config);
        },
        createPNGStream : function() {
            return this.canvas._canvas.createPNGStream();
        },
        /**
         * get layer canvas
         * @method
         * @memberof Kinetic.BaseLayer.prototype
         */
        getCanvas: function() {
            return this.canvas;
        },
        /**
         * get layer hit canvas
         * @method
         * @memberof Kinetic.BaseLayer.prototype
         */
        getHitCanvas: function() {
            return this.hitCanvas;
        },
        /**
         * get layer canvas context
         * @method
         * @memberof Kinetic.BaseLayer.prototype
         */
        getContext: function() {
            return this.getCanvas().getContext();
        },
        /**
         * clear scene and hit canvas contexts tied to the layer
         * @method
         * @memberof Kinetic.BaseLayer.prototype
         * @param {Object} [bounds]
         * @param {Number} [bounds.x]
         * @param {Number} [bounds.y]
         * @param {Number} [bounds.width]
         * @param {Number} [bounds.height]
         * @example
         * layer.clear();
         * layer.clear(0, 0, 100, 100);
         */
        clear: function(bounds) {
            this.getContext().clear(bounds);
            this.getHitCanvas().getContext().clear(bounds);
            return this;
        },
        clearHitCache: function() {
            this._hitImageData = undefined;
        },
        // extend Node.prototype.setZIndex
        setZIndex: function(index) {
            Kinetic.Node.prototype.setZIndex.call(this, index);
            var stage = this.getStage();
            if(stage) {
                stage.content.removeChild(this.getCanvas()._canvas);

                if(index < stage.getChildren().length - 1) {
                    stage.content.insertBefore(this.getCanvas()._canvas, stage.getChildren()[index + 1].getCanvas()._canvas);
                }
                else {
                    stage.content.appendChild(this.getCanvas()._canvas);
                }
            }
            return this;
        },
        // extend Node.prototype.moveToTop
        moveToTop: function() {
            Kinetic.Node.prototype.moveToTop.call(this);
            var stage = this.getStage();
            if(stage) {
                stage.content.removeChild(this.getCanvas()._canvas);
                stage.content.appendChild(this.getCanvas()._canvas);
            }
        },
        // extend Node.prototype.moveUp
        moveUp: function() {
            if(Kinetic.Node.prototype.moveUp.call(this)) {
                var stage = this.getStage();
                if(stage) {
                    stage.content.removeChild(this.getCanvas()._canvas);

                    if(this.index < stage.getChildren().length - 1) {
                        stage.content.insertBefore(this.getCanvas()._canvas, stage.getChildren()[this.index + 1].getCanvas()._canvas);
                    }
                    else {
                        stage.content.appendChild(this.getCanvas()._canvas);
                    }
                }
            }
        },
        // extend Node.prototype.moveDown
        moveDown: function() {
            if(Kinetic.Node.prototype.moveDown.call(this)) {
                var stage = this.getStage();
                if(stage) {
                    var children = stage.getChildren();
                    stage.content.removeChild(this.getCanvas()._canvas);
                    stage.content.insertBefore(this.getCanvas()._canvas, children[this.index + 1].getCanvas()._canvas);
                }
            }
        },
        // extend Node.prototype.moveToBottom
        moveToBottom: function() {
            if(Kinetic.Node.prototype.moveToBottom.call(this)) {
                var stage = this.getStage();
                if(stage) {
                    var children = stage.getChildren();
                    stage.content.removeChild(this.getCanvas()._canvas);
                    stage.content.insertBefore(this.getCanvas()._canvas, children[1].getCanvas()._canvas);
                }
            }
        },
        getLayer: function() {
            return this;
        },
        remove: function() {
            var _canvas = this.getCanvas()._canvas;

            Kinetic.Node.prototype.remove.call(this);

            if(_canvas && _canvas.parentNode && Kinetic.Util._isInDocument(_canvas)) {
                _canvas.parentNode.removeChild(_canvas);
            }
            return this;
        },
        getStage: function() {
            return this.parent;
        },
        setSize : function(width, height) {
            this.canvas.setSize(width, height);
        },
        /**
         * get/set width of layer.getter return width of stage. setter doing nothing.
         * if you want change width use `stage.width(value);`
         * @name width
         * @method
         * @memberof Kinetic.BaseLayer.prototype
         * @returns {Number}
         * @example
         * var width = layer.width();
         */
        getWidth : function() {
            if (this.parent) {
                return this.parent.getWidth();
            }
        },
        setWidth : function() {
            Kinetic.Util.warn('Can not change width of layer. Use "stage.width(value)" function instead.');
        },
        /**
         * get/set height of layer.getter return height of stage. setter doing nothing.
         * if you want change height use `stage.height(value);`
         * @name height
         * @method
         * @memberof Kinetic.BaseLayer.prototype
         * @returns {Number}
         * @example
         * var height = layer.height();
         */
        getHeight : function() {
            if (this.parent) {
                return this.parent.getHeight();
            }
        },
        setHeight : function() {
            Kinetic.Util.warn('Can not change height of layer. Use "stage.height(value)" function instead.');
        }
    });
    Kinetic.Util.extend(Kinetic.BaseLayer, Kinetic.Container);

    // add getters and setters
    Kinetic.Factory.addGetterSetter(Kinetic.BaseLayer, 'clearBeforeDraw', true);
    /**
     * get/set clearBeforeDraw flag which determines if the layer is cleared or not
     *  before drawing
     * @name clearBeforeDraw
     * @method
     * @memberof Kinetic.BaseLayer.prototype
     * @param {Boolean} clearBeforeDraw
     * @returns {Boolean}
     * @example
     * // get clearBeforeDraw flag
     * var clearBeforeDraw = layer.clearBeforeDraw();
     *
     * // disable clear before draw
     * layer.clearBeforeDraw(false);
     *
     * // enable clear before draw
     * layer.clearBeforeDraw(true);
     */

    Kinetic.Collection.mapMethods(Kinetic.BaseLayer);
})();
;(function() {
    // constants
    var HASH = '#',
        BEFORE_DRAW ='beforeDraw',
        DRAW = 'draw',

        /*
         * 2 - 3 - 4
         * |       |
         * 1 - 0   5
         *         |
         * 8 - 7 - 6
         */
        INTERSECTION_OFFSETS = [
            {x:  0, y:  0}, // 0
            {x: -1, y:  0}, // 1
            {x: -1, y: -1}, // 2
            {x:  0, y: -1}, // 3
            {x:  1, y: -1}, // 4
            {x:  1, y:  0}, // 5
            {x:  1, y:  1}, // 6
            {x:  0, y:  1}, // 7
            {x: -1, y:  1}  // 8
        ],
        INTERSECTION_OFFSETS_LEN = INTERSECTION_OFFSETS.length;


    Kinetic.Util.addMethods(Kinetic.Layer, {
        ____init: function(config) {
            this.nodeType = 'Layer';
            this.canvas = new Kinetic.SceneCanvas();
            this.hitCanvas = new Kinetic.HitCanvas();
            // call super constructor
            Kinetic.BaseLayer.call(this, config);
        },
        _setCanvasSize: function(width, height) {
            this.canvas.setSize(width, height);
            this.hitCanvas.setSize(width, height);
        },
        _validateAdd: function(child) {
            var type = child.getType();
            if (type !== 'Group' && type !== 'Shape') {
                Kinetic.Util.error('You may only add groups and shapes to a layer.');
            }
        },
        /**
         * get visible intersection shape. This is the preferred
         * method for determining if a point intersects a shape or not
         * @method
         * @memberof Kinetic.Layer.prototype
         * @param {Object} pos
         * @param {Number} pos.x
         * @param {Number} pos.y
         * @returns {Kinetic.Shape}
         */
        getIntersection: function(pos) {
            var obj, i, intersectionOffset, shape;

            if(this.hitGraphEnabled() && this.isVisible()) {
                // in some cases antialiased area may be bigger than 1px
                // it is possible if we will cache node, then scale it a lot
                // TODO: check { 0; 0 } point before loop, and remove it from INTERSECTION_OFFSETS.
                var spiralSearchDistance = 1;
                var continueSearch = false;
                while (true) {
                    for (i=0; i<INTERSECTION_OFFSETS_LEN; i++) {
                        intersectionOffset = INTERSECTION_OFFSETS[i];
                        obj = this._getIntersection({
                            x: pos.x + intersectionOffset.x * spiralSearchDistance,
                            y: pos.y + intersectionOffset.y * spiralSearchDistance
                        });
                        shape = obj.shape;
                        if (shape) {
                            return shape;
                        }
                        // we should continue search if we found antialiased pixel
                        // that means our node somewhere very close
                        else if (obj.antialiased) {
                            continueSearch = true;
                        }
                    }
                    // if no shape, and no antialiased pixel, we should end searching
                    if (continueSearch) {
                        spiralSearchDistance += 1;
                    } else {
                        return;
                    }
                }
            } else {
                return null;
            }
        },
        _getImageData: function(x, y) {
            var width = this.hitCanvas.width || 1,
                height = this.hitCanvas.height || 1,
                index = (Math.round(y) * width ) + Math.round(x);

            if (!this._hitImageData) {
                this._hitImageData = this.hitCanvas.context.getImageData(0, 0, width, height);
            }

            return [
                this._hitImageData.data[4 * index + 0] , // Red
                this._hitImageData.data[4 * index + 1], // Green
                this._hitImageData.data[4 * index + 2], // Blue
                this._hitImageData.data[4 * index + 3] // Alpha
            ];
        },
        _getIntersection: function(pos) {
            var p = this.hitCanvas.context.getImageData(pos.x, pos.y, 1, 1).data,
                p3 = p[3],
                colorKey, shape;

            // fully opaque pixel
            if(p3 === 255) {
                colorKey = Kinetic.Util._rgbToHex(p[0], p[1], p[2]);
                shape = Kinetic.shapes[HASH + colorKey];
                return {
                    shape: shape
                };
            }
            // antialiased pixel
            else if(p3 > 0) {
                return {
                    antialiased: true
                };
            }
            // empty pixel
            else {
                return {};
            }
        },
        drawScene: function(can, top) {
            var layer = this.getLayer(),
                canvas = can || (layer && layer.getCanvas());

            this._fire(BEFORE_DRAW, {
                node: this
            });

            if(this.getClearBeforeDraw()) {
                canvas.getContext().clear();
            }

            Kinetic.Container.prototype.drawScene.call(this, canvas, top);

            this._fire(DRAW, {
                node: this
            });

            return this;
        },
        // the apply transform method is handled by the Layer and FastLayer class
        // because it is up to the layer to decide if an absolute or relative transform
        // should be used
        _applyTransform: function(shape, context, top) {
            var m = shape.getAbsoluteTransform(top).getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        },
        drawHit: function(can, top) {
            var layer = this.getLayer(),
                canvas = can || (layer && layer.hitCanvas);

            if(layer && layer.getClearBeforeDraw()) {
                layer.getHitCanvas().getContext().clear();
            }

            Kinetic.Container.prototype.drawHit.call(this, canvas, top);
            this.imageData = null; // Clear imageData cache
            return this;
        },
        /**
         * clear scene and hit canvas contexts tied to the layer
         * @method
         * @memberof Kinetic.Layer.prototype
         * @param {Object} [bounds]
         * @param {Number} [bounds.x]
         * @param {Number} [bounds.y]
         * @param {Number} [bounds.width]
         * @param {Number} [bounds.height]
         * @example
         * layer.clear();
         * layer.clear(0, 0, 100, 100);
         */
        clear: function(bounds) {
            this.getContext().clear(bounds);
            this.getHitCanvas().getContext().clear(bounds);
            this.imageData = null; // Clear getImageData cache
            return this;
        },
        // extend Node.prototype.setVisible
        setVisible: function(visible) {
            Kinetic.Node.prototype.setVisible.call(this, visible);
            if(visible) {
                this.getCanvas()._canvas.style.display = 'block';
                this.hitCanvas._canvas.style.display = 'block';
            }
            else {
                this.getCanvas()._canvas.style.display = 'none';
                this.hitCanvas._canvas.style.display = 'none';
            }
            return this;
        },
        /**
         * enable hit graph
         * @name enableHitGraph
         * @method
         * @memberof Kinetic.Layer.prototype
         * @returns {Layer}
         */
        enableHitGraph: function() {
            this.setHitGraphEnabled(true);
            return this;
        },
        /**
         * disable hit graph
         * @name disableHitGraph
         * @method
         * @memberof Kinetic.Layer.prototype
         * @returns {Layer}
         */
        disableHitGraph: function() {
            this.setHitGraphEnabled(false);
            return this;
        },
        setSize : function(width, height) {
            Kinetic.BaseLayer.prototype.setSize.call(this, width, height);
            this.hitCanvas.setSize(width, height);
        }
    });
    Kinetic.Util.extend(Kinetic.Layer, Kinetic.BaseLayer);

    Kinetic.Factory.addGetterSetter(Kinetic.Layer, 'hitGraphEnabled', true);
    /**
     * get/set hitGraphEnabled flag.  Disabling the hit graph will greatly increase
     *  draw performance because the hit graph will not be redrawn each time the layer is
     *  drawn.  This, however, also disables mouse/touch event detection
     * @name hitGraphEnabled
     * @method
     * @memberof Kinetic.Layer.prototype
     * @param {Boolean} enabled
     * @returns {Boolean}
     * @example
     * // get hitGraphEnabled flag
     * var hitGraphEnabled = layer.hitGraphEnabled();
     *
     * // disable hit graph
     * layer.hitGraphEnabled(false);
     *
     * // enable hit graph
     * layer.hitGraphEnabled(true);
     */
    Kinetic.Collection.mapMethods(Kinetic.Layer);
})();
;(function() {

    Kinetic.Util.addMethods(Kinetic.FastLayer, {
        ____init: function(config) {
            this.nodeType = 'Layer';
            this.canvas = new Kinetic.SceneCanvas();
            // call super constructor
            Kinetic.BaseLayer.call(this, config);
        },
        _validateAdd: function(child) {
            var type = child.getType();
            if (type !== 'Shape') {
                Kinetic.Util.error('You may only add shapes to a fast layer.');
            }
        },
        _setCanvasSize: function(width, height) {
            this.canvas.setSize(width, height);
        },
        hitGraphEnabled: function() {
            return false;
        },
        getIntersection: function() {
            return null;
        },
        drawScene: function(can) {
            var layer = this.getLayer(),
                canvas = can || (layer && layer.getCanvas());

            if(this.getClearBeforeDraw()) {
                canvas.getContext().clear();
            }

            Kinetic.Container.prototype.drawScene.call(this, canvas);

            return this;
        },
        // the apply transform method is handled by the Layer and FastLayer class
        // because it is up to the layer to decide if an absolute or relative transform
        // should be used
        _applyTransform: function(shape, context, top) {
            if (!top || top._id !== this._id) {
                var m = shape.getTransform().getMatrix();
                context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
            }
        },
        draw: function() {
            this.drawScene();
            return this;
        },
        /**
         * clear scene and hit canvas contexts tied to the layer
         * @method
         * @memberof Kinetic.FastLayer.prototype
         * @param {Object} [bounds]
         * @param {Number} [bounds.x]
         * @param {Number} [bounds.y]
         * @param {Number} [bounds.width]
         * @param {Number} [bounds.height]
         * @example
         * layer.clear();
         * layer.clear(0, 0, 100, 100);
         */
        clear: function(bounds) {
            this.getContext().clear(bounds);
            return this;
        },
        // extend Node.prototype.setVisible
        setVisible: function(visible) {
            Kinetic.Node.prototype.setVisible.call(this, visible);
            if(visible) {
                this.getCanvas()._canvas.style.display = 'block';
            }
            else {
                this.getCanvas()._canvas.style.display = 'none';
            }
            return this;
        }
    });
    Kinetic.Util.extend(Kinetic.FastLayer, Kinetic.BaseLayer);

    Kinetic.Collection.mapMethods(Kinetic.FastLayer);
})();
;(function() {
    Kinetic.Util.addMethods(Kinetic.Group, {
        ___init: function(config) {
            this.nodeType = 'Group';
            // call super constructor
            Kinetic.Container.call(this, config);
        },
        _validateAdd: function(child) {
            var type = child.getType();
            if (type !== 'Group' && type !== 'Shape') {
                Kinetic.Util.error('You may only add groups and shapes to groups.');
            }
        }
    });
    Kinetic.Util.extend(Kinetic.Group, Kinetic.Container);

    Kinetic.Collection.mapMethods(Kinetic.Group);
})();
;(function() {
    /**
     * Rect constructor
     * @constructor
     * @memberof Kinetic
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Number} [config.cornerRadius]
     * @param {String} [config.fill] fill color
     * @param {Integer} [config.fillRed] set fill red component
     * @param {Integer} [config.fillGreen] set fill green component
     * @param {Integer} [config.fillBlue] set fill blue component
     * @param {Integer} [config.fillAlpha] set fill alpha component
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX]
     * @param {Number} [config.fillPatternOffsetY]
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX]
     * @param {Number} [config.fillRadialGradientEndPointY]
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Integer} [config.strokeRed] set stroke red component
     * @param {Integer} [config.strokeGreen] set stroke green component
     * @param {Integer} [config.strokeBlue] set stroke blue component
     * @param {Integer} [config.strokeAlpha] set stroke alpha component
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Integer} [config.shadowRed] set shadow color red component
     * @param {Integer} [config.shadowGreen] set shadow color green component
     * @param {Integer} [config.shadowBlue] set shadow color blue component
     * @param {Integer} [config.shadowAlpha] set shadow color alpha component
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var rect = new Kinetic.Rect({
     *   width: 100,
     *   height: 50,
     *   fill: 'red',
     *   stroke: 'black',
     *   strokeWidth: 5
     * });
     */
    Kinetic.Rect = function(config) {
        this.___init(config);
    };

    Kinetic.Rect.prototype = {
        ___init: function(config) {
            Kinetic.Shape.call(this, config);
            this.className = 'Rect';
            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            var cornerRadius = this.getCornerRadius(),
                width = this.getWidth(),
                height = this.getHeight();


            context.beginPath();

            if(!cornerRadius) {
                // simple rect - don't bother doing all that complicated maths stuff.
                context.rect(0, 0, width, height);
            }
            else {
                // arcTo would be nicer, but browser support is patchy (Opera)
                context.moveTo(cornerRadius, 0);
                context.lineTo(width - cornerRadius, 0);
                context.arc(width - cornerRadius, cornerRadius, cornerRadius, Math.PI * 3 / 2, 0, false);
                context.lineTo(width, height - cornerRadius);
                context.arc(width - cornerRadius, height - cornerRadius, cornerRadius, 0, Math.PI / 2, false);
                context.lineTo(cornerRadius, height);
                context.arc(cornerRadius, height - cornerRadius, cornerRadius, Math.PI / 2, Math.PI, false);
                context.lineTo(0, cornerRadius);
                context.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, Math.PI * 3 / 2, false);
            }
            context.closePath();
            context.fillStrokeShape(this);
        }
    };

    Kinetic.Util.extend(Kinetic.Rect, Kinetic.Shape);

    Kinetic.Factory.addGetterSetter(Kinetic.Rect, 'cornerRadius', 0);
    /**
     * get/set corner radius
     * @name cornerRadius
     * @method
     * @memberof Kinetic.Rect.prototype
     * @param {Number} cornerRadius
     * @returns {Number}
     * @example
     * // get corner radius
     * var cornerRadius = rect.cornerRadius();
     *
     * // set corner radius
     * rect.cornerRadius(10);
     */

    Kinetic.Collection.mapMethods(Kinetic.Rect);
})();
;(function() {
    // the 0.0001 offset fixes a bug in Chrome 27
    var PIx2 = (Math.PI * 2) - 0.0001,
        CIRCLE = 'Circle';

    /**
     * Circle constructor
     * @constructor
     * @memberof Kinetic
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Number} config.radius
     * @param {String} [config.fill] fill color
     * @param {Integer} [config.fillRed] set fill red component
     * @param {Integer} [config.fillGreen] set fill green component
     * @param {Integer} [config.fillBlue] set fill blue component
     * @param {Integer} [config.fillAlpha] set fill alpha component
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX]
     * @param {Number} [config.fillPatternOffsetY]
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX]
     * @param {Number} [config.fillRadialGradientEndPointY]
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Integer} [config.strokeRed] set stroke red component
     * @param {Integer} [config.strokeGreen] set stroke green component
     * @param {Integer} [config.strokeBlue] set stroke blue component
     * @param {Integer} [config.strokeAlpha] set stroke alpha component
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Integer} [config.shadowRed] set shadow color red component
     * @param {Integer} [config.shadowGreen] set shadow color green component
     * @param {Integer} [config.shadowBlue] set shadow color blue component
     * @param {Integer} [config.shadowAlpha] set shadow color alpha component
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * // create circle
     * var circle = new Kinetic.Circle({
     *   radius: 40,
     *   fill: 'red',
     *   stroke: 'black'
     *   strokeWidth: 5
     * });
     */
    Kinetic.Circle = function(config) {
        this.___init(config);
    };

    Kinetic.Circle.prototype = {
        ___init: function(config) {
            // call super constructor
            Kinetic.Shape.call(this, config);
            this.className = CIRCLE;
            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            context.beginPath();
            context.arc(0, 0, this.getRadius(), 0, PIx2, false);
            context.closePath();
            context.fillStrokeShape(this);
        },
        // implements Shape.prototype.getWidth()
        getWidth: function() {
            return this.getRadius() * 2;
        },
        // implements Shape.prototype.getHeight()
        getHeight: function() {
            return this.getRadius() * 2;
        },
        // implements Shape.prototype.setWidth()
        setWidth: function(width) {
            Kinetic.Node.prototype.setWidth.call(this, width);
            if (this.radius() !== width / 2) {
                this.setRadius(width / 2);
            }
        },
        // implements Shape.prototype.setHeight()
        setHeight: function(height) {
            Kinetic.Node.prototype.setHeight.call(this, height);
            if (this.radius() !== height / 2) {
                this.setRadius(height / 2);
            }
        },
        setRadius : function(val) {
            this._setAttr('radius', val);
            this.setWidth(val * 2);
            this.setHeight(val * 2);
        }
    };
    Kinetic.Util.extend(Kinetic.Circle, Kinetic.Shape);

    // add getters setters
    Kinetic.Factory.addGetter(Kinetic.Circle, 'radius', 0);
    Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Circle, 'radius');

    /**
     * get/set radius
     * @name radius
     * @method
     * @memberof Kinetic.Circle.prototype
     * @param {Number} radius
     * @returns {Number}
     * @example
     * // get radius
     * var radius = circle.radius();
     *
     * // set radius
     * circle.radius(10);
     */

    Kinetic.Collection.mapMethods(Kinetic.Circle);
})();
;(function() {
    // the 0.0001 offset fixes a bug in Chrome 27
    var PIx2 = (Math.PI * 2) - 0.0001,
        ELLIPSE = 'Ellipse';

    /**
     * Ellipse constructor
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Object} config.radius defines x and y radius
     * @@ShapeParams
     * @@NodeParams
     * @example
     * var ellipse = new Kinetic.Ellipse({
     *   radius : {
     *     x : 50,
     *     y : 50
     *   },
     *   fill: 'red'
     * });
     */
    Kinetic.Ellipse = function(config) {
        this.___init(config);
    };

    Kinetic.Ellipse.prototype = {
        ___init: function(config) {
            // call super constructor
            Kinetic.Shape.call(this, config);
            this.className = ELLIPSE;
            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            var rx = this.getRadiusX(),
                ry = this.getRadiusY();

            context.beginPath();
            context.save();
            if(rx !== ry) {
                context.scale(1, ry / rx);
            }
            context.arc(0, 0, rx, 0, PIx2, false);
            context.restore();
            context.closePath();
            context.fillStrokeShape(this);
        },
        // implements Shape.prototype.getWidth()
        getWidth: function() {
            return this.getRadiusX() * 2;
        },
        // implements Shape.prototype.getHeight()
        getHeight: function() {
            return this.getRadiusY() * 2;
        },
        // implements Shape.prototype.setWidth()
        setWidth: function(width) {
            Kinetic.Node.prototype.setWidth.call(this, width);
            this.setRadius({
                x: width / 2
            });
        },
        // implements Shape.prototype.setHeight()
        setHeight: function(height) {
            Kinetic.Node.prototype.setHeight.call(this, height);
            this.setRadius({
                y: height / 2
            });
        }
    };
    Kinetic.Util.extend(Kinetic.Ellipse, Kinetic.Shape);

    // add getters setters
    Kinetic.Factory.addComponentsGetterSetter(Kinetic.Ellipse, 'radius', ['x', 'y']);

    /**
     * get/set radius
     * @name radius
     * @method
     * @memberof Kinetic.Ellipse.prototype
     * @param {Object} radius
     * @param {Number} radius.x
     * @param {Number} radius.y
     * @returns {Object}
     * @example
     * // get radius
     * var radius = ellipse.radius();
     *
     * // set radius
     * ellipse.radius({
     *   x: 200,
     *   y: 100
     * });
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Ellipse, 'radiusX', 0);
    /**
     * get/set radius x
     * @name radiusX
     * @method
     * @memberof Kinetic.Ellipse.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get radius x
     * var radiusX = ellipse.radiusX();
     *
     * // set radius x
     * ellipse.radiusX(200);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Ellipse, 'radiusY', 0);
    /**
     * get/set radius y
     * @name radiusY
     * @method
     * @memberof Kinetic.Ellipse.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get radius y
     * var radiusY = ellipse.radiusY();
     *
     * // set radius y
     * ellipse.radiusY(200);
     */

    Kinetic.Collection.mapMethods(Kinetic.Ellipse);

})();;(function() {
    // the 0.0001 offset fixes a bug in Chrome 27
    var PIx2 = (Math.PI * 2) - 0.0001;

    /**
     * Ring constructor
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Number} config.innerRadius
     * @param {Number} config.outerRadius
     * @param {Boolean} [config.clockwise]
     * @param {String} [config.fill] fill color
     * @param {Integer} [config.fillRed] set fill red component
     * @param {Integer} [config.fillGreen] set fill green component
     * @param {Integer} [config.fillBlue] set fill blue component
     * @param {Integer} [config.fillAlpha] set fill alpha component
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX]
     * @param {Number} [config.fillPatternOffsetY]
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX]
     * @param {Number} [config.fillRadialGradientEndPointY]
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Integer} [config.strokeRed] set stroke red component
     * @param {Integer} [config.strokeGreen] set stroke green component
     * @param {Integer} [config.strokeBlue] set stroke blue component
     * @param {Integer} [config.strokeAlpha] set stroke alpha component
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Integer} [config.shadowRed] set shadow color red component
     * @param {Integer} [config.shadowGreen] set shadow color green component
     * @param {Integer} [config.shadowBlue] set shadow color blue component
     * @param {Integer} [config.shadowAlpha] set shadow color alpha component
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var ring = new Kinetic.Ring({
     *   innerRadius: 40,
     *   outerRadius: 80,
     *   fill: 'red',
     *   stroke: 'black',
     *   strokeWidth: 5
     * });
     */
    Kinetic.Ring = function(config) {
        this.___init(config);
    };

    Kinetic.Ring.prototype = {
        ___init: function(config) {
            // call super constructor
            Kinetic.Shape.call(this, config);
            this.className = 'Ring';
            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            context.beginPath();
            context.arc(0, 0, this.getInnerRadius(), 0, PIx2, false);
            context.moveTo(this.getOuterRadius(), 0);
            context.arc(0, 0, this.getOuterRadius(), PIx2, 0, true);
            context.closePath();
            context.fillStrokeShape(this);
        },
        // implements Shape.prototype.getWidth()
        getWidth: function() {
            return this.getOuterRadius() * 2;
        },
        // implements Shape.prototype.getHeight()
        getHeight: function() {
            return this.getOuterRadius() * 2;
        },
        // implements Shape.prototype.setWidth()
        setWidth: function(width) {
            Kinetic.Node.prototype.setWidth.call(this, width);
            if (this.outerRadius() !== width / 2) {
                this.setOuterRadius(width / 2);
            }
        },
        // implements Shape.prototype.setHeight()
        setHeight: function(height) {
            Kinetic.Node.prototype.setHeight.call(this, height);
            if (this.outerRadius() !== height / 2) {
                this.setOuterRadius(height / 2);
            }
        },
        setOuterRadius : function(val) {
            this._setAttr('outerRadius', val);
            this.setWidth(val * 2);
            this.setHeight(val * 2);
        }
    };
    Kinetic.Util.extend(Kinetic.Ring, Kinetic.Shape);

    // add getters setters
    Kinetic.Factory.addGetterSetter(Kinetic.Ring, 'innerRadius', 0);

    /**
     * get/set innerRadius
     * @name innerRadius
     * @method
     * @memberof Kinetic.Ring.prototype
     * @param {Number} innerRadius
     * @returns {Number}
     * @example
     * // get inner radius
     * var innerRadius = ring.innerRadius();
     *
     * // set inner radius
     * ring.innerRadius(20);
     */

    Kinetic.Factory.addGetter(Kinetic.Ring, 'outerRadius', 0);
    Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Ring, 'outerRadius');

    /**
     * get/set outerRadius
     * @name outerRadius
     * @method
     * @memberof Kinetic.Ring.prototype
     * @param {Number} outerRadius
     * @returns {Number}
     * @example
     * // get outer radius
     * var outerRadius = ring.outerRadius();
     *
     * // set outer radius
     * ring.outerRadius(20);
     */

    Kinetic.Collection.mapMethods(Kinetic.Ring);
})();
;(function() {
    /**
     * Wedge constructor
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Number} config.angle in degrees
     * @param {Number} config.radius
     * @param {Boolean} [config.clockwise]
     * @param {String} [config.fill] fill color
     * @param {Integer} [config.fillRed] set fill red component
     * @param {Integer} [config.fillGreen] set fill green component
     * @param {Integer} [config.fillBlue] set fill blue component
     * @param {Integer} [config.fillAlpha] set fill alpha component
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX]
     * @param {Number} [config.fillPatternOffsetY]
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX]
     * @param {Number} [config.fillRadialGradientEndPointY]
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Integer} [config.strokeRed] set stroke red component
     * @param {Integer} [config.strokeGreen] set stroke green component
     * @param {Integer} [config.strokeBlue] set stroke blue component
     * @param {Integer} [config.strokeAlpha] set stroke alpha component
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Integer} [config.shadowRed] set shadow color red component
     * @param {Integer} [config.shadowGreen] set shadow color green component
     * @param {Integer} [config.shadowBlue] set shadow color blue component
     * @param {Integer} [config.shadowAlpha] set shadow color alpha component
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * // draw a wedge that's pointing downwards
     * var wedge = new Kinetic.Wedge({
     *   radius: 40,
     *   fill: 'red',
     *   stroke: 'black'
     *   strokeWidth: 5,
     *   angleDeg: 60,
     *   rotationDeg: -120
     * });
     */
    Kinetic.Wedge = function(config) {
        this.___init(config);
    };

    Kinetic.Wedge.prototype = {
        ___init: function(config) {
            // call super constructor
            Kinetic.Shape.call(this, config);
            this.className = 'Wedge';
            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            context.beginPath();
            context.arc(0, 0, this.getRadius(), 0, Kinetic.getAngle(this.getAngle()), this.getClockwise());
            context.lineTo(0, 0);
            context.closePath();
            context.fillStrokeShape(this);
        }
    };
    Kinetic.Util.extend(Kinetic.Wedge, Kinetic.Shape);

    // add getters setters
    Kinetic.Factory.addGetterSetter(Kinetic.Wedge, 'radius', 0);

    /**
     * get/set radius
     * @name radius
     * @method
     * @memberof Kinetic.Wedge.prototype
     * @param {Number} radius
     * @returns {Number}
     * @example
     * // get radius
     * var radius = wedge.radius();
     *
     * // set radius
     * wedge.radius(10);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Wedge, 'angle', 0);

    /**
     * get/set angle in degrees
     * @name angle
     * @method
     * @memberof Kinetic.Wedge.prototype
     * @param {Number} angle
     * @returns {Number}
     * @example
     * // get angle
     * var angle = wedge.angle();
     *
     * // set angle
     * wedge.angle(20);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Wedge, 'clockwise', false);

    /**
     * get/set clockwise flag
     * @name clockwise
     * @method
     * @memberof Kinetic.Wedge.prototype
     * @param {Number} clockwise
     * @returns {Number}
     * @example
     * // get clockwise flag
     * var clockwise = wedge.clockwise();
     *
     * // draw wedge counter-clockwise
     * wedge.clockwise(false);
     *
     * // draw wedge clockwise
     * wedge.clockwise(true);
     */

    Kinetic.Factory.backCompat(Kinetic.Wedge, {
        angleDeg: 'angle',
        getAngleDeg: 'getAngle',
        setAngleDeg: 'setAngle'
    });

    Kinetic.Collection.mapMethods(Kinetic.Wedge);
})();
;(function() {
    /**
     * Arc constructor
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Number} config.angle in degrees
     * @param {Number} config.innerRadius
     * @param {Number} config.outerRadius
     * @param {Boolean} [config.clockwise]
     * @param {String} [config.fill] fill color
     * @param {Integer} [config.fillRed] set fill red component
     * @param {Integer} [config.fillGreen] set fill green component
     * @param {Integer} [config.fillBlue] set fill blue component
     * @param {Integer} [config.fillAlpha] set fill alpha component
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX]
     * @param {Number} [config.fillPatternOffsetY]
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX]
     * @param {Number} [config.fillRadialGradientEndPointY]
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Integer} [config.strokeRed] set stroke red component
     * @param {Integer} [config.strokeGreen] set stroke green component
     * @param {Integer} [config.strokeBlue] set stroke blue component
     * @param {Integer} [config.strokeAlpha] set stroke alpha component
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Integer} [config.shadowRed] set shadow color red component
     * @param {Integer} [config.shadowGreen] set shadow color green component
     * @param {Integer} [config.shadowBlue] set shadow color blue component
     * @param {Integer} [config.shadowAlpha] set shadow color alpha component
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * // draw a Arc that's pointing downwards
     * var arc = new Kinetic.Arc({
     *   innerRadius: 40,
     *   outerRadius: 80,
     *   fill: 'red',
     *   stroke: 'black'
     *   strokeWidth: 5,
     *   angle: 60,
     *   rotationDeg: -120
     * });
     */
    Kinetic.Arc = function(config) {
        this.___init(config);
    };

    Kinetic.Arc.prototype = {
        ___init: function(config) {
            // call super constructor
            Kinetic.Shape.call(this, config);
            this.className = 'Arc';
            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            var angle = Kinetic.getAngle(this.angle()),
                clockwise = this.clockwise();

            context.beginPath();
            context.arc(0, 0, this.getOuterRadius(), 0, angle, clockwise);
            context.arc(0, 0, this.getInnerRadius(), angle, 0, !clockwise);
            context.closePath();
            context.fillStrokeShape(this);
        }
    };
    Kinetic.Util.extend(Kinetic.Arc, Kinetic.Shape);

    // add getters setters
    Kinetic.Factory.addGetterSetter(Kinetic.Arc, 'innerRadius', 0);

    /**
     * get/set innerRadius
     * @name innerRadius
     * @method
     * @memberof Kinetic.Arc.prototype
     * @param {Number} innerRadius
     * @returns {Number}
     * @example
     * // get inner radius
     * var innerRadius = arc.innerRadius();
     *
     * // set inner radius
     * arc.innerRadius(20);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Arc, 'outerRadius', 0);

    /**
     * get/set outerRadius
     * @name outerRadius
     * @method
     * @memberof Kinetic.Arc.prototype
     * @param {Number} outerRadius
     * @returns {Number}
     * @example
     * // get outer radius
     * var outerRadius = arc.outerRadius();
     *
     * // set outer radius
     * arc.outerRadius(20);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Arc, 'angle', 0);

    /**
     * get/set angle in degrees
     * @name angle
     * @method
     * @memberof Kinetic.Arc.prototype
     * @param {Number} angle
     * @returns {Number}
     * @example
     * // get angle
     * var angle = arc.angle();
     *
     * // set angle
     * arc.angle(20);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Arc, 'clockwise', false);

    /**
     * get/set clockwise flag
     * @name clockwise
     * @method
     * @memberof Kinetic.Arc.prototype
     * @param {Boolean} clockwise
     * @returns {Boolean}
     * @example
     * // get clockwise flag
     * var clockwise = arc.clockwise();
     *
     * // draw arc counter-clockwise
     * arc.clockwise(false);
     *
     * // draw arc clockwise
     * arc.clockwise(true);
     */

    Kinetic.Collection.mapMethods(Kinetic.Arc);
})();
;(function() {

    // CONSTANTS
    var IMAGE = 'Image';

    /**
     * Image constructor
     * @constructor
     * @memberof Kinetic
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Image} config.image
     * @param {Object} [config.crop]
     * @param {String} [config.fill] fill color
     * @param {Integer} [config.fillRed] set fill red component
     * @param {Integer} [config.fillGreen] set fill green component
     * @param {Integer} [config.fillBlue] set fill blue component
     * @param {Integer} [config.fillAlpha] set fill alpha component
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX]
     * @param {Number} [config.fillPatternOffsetY]
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX]
     * @param {Number} [config.fillRadialGradientEndPointY]
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Integer} [config.strokeRed] set stroke red component
     * @param {Integer} [config.strokeGreen] set stroke green component
     * @param {Integer} [config.strokeBlue] set stroke blue component
     * @param {Integer} [config.strokeAlpha] set stroke alpha component
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Integer} [config.shadowRed] set shadow color red component
     * @param {Integer} [config.shadowGreen] set shadow color green component
     * @param {Integer} [config.shadowBlue] set shadow color blue component
     * @param {Integer} [config.shadowAlpha] set shadow color alpha component
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var imageObj = new Image();
     * imageObj.onload = function() {
     *   var image = new Kinetic.Image({
     *     x: 200,
     *     y: 50,
     *     image: imageObj,
     *     width: 100,
     *     height: 100
     *   });
     * };
     * imageObj.src = '/path/to/image.jpg'
     */
    Kinetic.Image = function(config) {
        this.___init(config);
    };

    Kinetic.Image.prototype = {
        ___init: function(config) {
            // call super constructor
            Kinetic.Shape.call(this, config);
            this.className = IMAGE;
            this.sceneFunc(this._sceneFunc);
            this.hitFunc(this._hitFunc);
        },
        _useBufferCanvas: function() {
            return (this.hasShadow() || this.getAbsoluteOpacity() !== 1) && this.hasStroke() && this.getStage();
        },
        _sceneFunc: function(context) {
            var width = this.getWidth(),
                height = this.getHeight(),
                image = this.getImage(),
                cropWidth, cropHeight, params;

            if (image) {
                cropWidth = this.getCropWidth();
                cropHeight = this.getCropHeight();
                if (cropWidth && cropHeight) {
                    params = [image, this.getCropX(), this.getCropY(), cropWidth, cropHeight, 0, 0, width, height];
                } else {
                    params = [image, 0, 0, width, height];
                }
            }

            if (this.hasFill() || this.hasStroke() || this.hasShadow()) {
                context.beginPath();
                context.rect(0, 0, width, height);
                context.closePath();
                context.fillStrokeShape(this);
            }

            if (image) {
                context.drawImage.apply(context, params);
            }
        },
        _hitFunc: function(context) {
            var width = this.getWidth(),
                height = this.getHeight();

            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            context.fillStrokeShape(this);
        },
        getWidth: function() {
            var image = this.getImage();
            return this.attrs.width || (image ? image.width : 0);
        },
        getHeight: function() {
            var image = this.getImage();
            return this.attrs.height || (image ? image.height : 0);
        }
    };
    Kinetic.Util.extend(Kinetic.Image, Kinetic.Shape);

    // add getters setters
    Kinetic.Factory.addGetterSetter(Kinetic.Image, 'image');

    /**
     * set image
     * @name setImage
     * @method
     * @memberof Kinetic.Image.prototype
     * @param {Image} image
     */

    /**
     * get image
     * @name getImage
     * @method
     * @memberof Kinetic.Image.prototype
     * @returns {Image}
     */

    Kinetic.Factory.addComponentsGetterSetter(Kinetic.Image, 'crop', ['x', 'y', 'width', 'height']);
    /**
     * get/set crop
     * @method
     * @name crop
     * @memberof Kinetic.Image.prototype
     * @param {Object} crop
     * @param {Number} crop.x
     * @param {Number} crop.y
     * @param {Number} crop.width
     * @param {Number} crop.height
     * @returns {Object}
     * @example
     * // get crop
     * var crop = image.crop();
     *
     * // set crop
     * image.crop({
     *   x: 20,
     *   y: 20,
     *   width: 20,
     *   height: 20
     * });
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Image, 'cropX', 0);
    /**
     * get/set crop x
     * @method
     * @name cropX
     * @memberof Kinetic.Image.prototype
     * @param {Number} x
     * @returns {Number}
     * @example
     * // get crop x
     * var cropX = image.cropX();
     *
     * // set crop x
     * image.cropX(20);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Image, 'cropY', 0);
    /**
     * get/set crop y
     * @name cropY
     * @method
     * @memberof Kinetic.Image.prototype
     * @param {Number} y
     * @returns {Number}
     * @example
     * // get crop y
     * var cropY = image.cropY();
     *
     * // set crop y
     * image.cropY(20);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Image, 'cropWidth', 0);
    /**
     * get/set crop width
     * @name cropWidth
     * @method
     * @memberof Kinetic.Image.prototype
     * @param {Number} width
     * @returns {Number}
     * @example
     * // get crop width
     * var cropWidth = image.cropWidth();
     *
     * // set crop width
     * image.cropWidth(20);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Image, 'cropHeight', 0);
    /**
     * get/set crop height
     * @name cropHeight
     * @method
     * @memberof Kinetic.Image.prototype
     * @param {Number} height
     * @returns {Number}
     * @example
     * // get crop height
     * var cropHeight = image.cropHeight();
     *
     * // set crop height
     * image.cropHeight(20);
     */

    Kinetic.Collection.mapMethods(Kinetic.Image);
})();
;(function() {
    // constants
    var AUTO = 'auto',
        //CANVAS = 'canvas',
        CENTER = 'center',
        CHANGE_KINETIC = 'Change.kinetic',
        CONTEXT_2D = '2d',
        DASH = '-',
        EMPTY_STRING = '',
        LEFT = 'left',
        TEXT = 'text',
        TEXT_UPPER = 'Text',
        MIDDLE = 'middle',
        NORMAL = 'normal',
        PX_SPACE = 'px ',
        SPACE = ' ',
        RIGHT = 'right',
        WORD = 'word',
        CHAR = 'char',
        NONE = 'none',
        ATTR_CHANGE_LIST = ['fontFamily', 'fontSize', 'fontStyle', 'fontVariant', 'padding', 'align', 'lineHeight', 'text', 'width', 'height', 'wrap'],

        // cached variables
        attrChangeListLen = ATTR_CHANGE_LIST.length,
        dummyContext = Kinetic.Util.createCanvasElement().getContext(CONTEXT_2D);

    /**
     * Text constructor
     * @constructor
     * @memberof Kinetic
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {String} [config.fontFamily] default is Arial
     * @param {Number} [config.fontSize] in pixels.  Default is 12
     * @param {String} [config.fontStyle] can be normal, bold, or italic.  Default is normal
     * @param {String} [config.fontVariant] can be normal or small-caps.  Default is normal
     * @param {String} config.text
     * @param {String} [config.align] can be left, center, or right
     * @param {Number} [config.padding]
     * @param {Number} [config.width] default is auto
     * @param {Number} [config.height] default is auto
     * @param {Number} [config.lineHeight] default is 1
     * @param {String} [config.wrap] can be word, char, or none. Default is word
     * @param {String} [config.fill] fill color
     * @param {Integer} [config.fillRed] set fill red component
     * @param {Integer} [config.fillGreen] set fill green component
     * @param {Integer} [config.fillBlue] set fill blue component
     * @param {Integer} [config.fillAlpha] set fill alpha component
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX]
     * @param {Number} [config.fillPatternOffsetY]
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX]
     * @param {Number} [config.fillRadialGradientEndPointY]
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Integer} [config.strokeRed] set stroke red component
     * @param {Integer} [config.strokeGreen] set stroke green component
     * @param {Integer} [config.strokeBlue] set stroke blue component
     * @param {Integer} [config.strokeAlpha] set stroke alpha component
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Integer} [config.shadowRed] set shadow color red component
     * @param {Integer} [config.shadowGreen] set shadow color green component
     * @param {Integer} [config.shadowBlue] set shadow color blue component
     * @param {Integer} [config.shadowAlpha] set shadow color alpha component
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var text = new Kinetic.Text({
     *   x: 10,
     *   y: 15,
     *   text: 'Simple Text',
     *   fontSize: 30,
     *   fontFamily: 'Calibri',
     *   fill: 'green'
     * });
     */
    Kinetic.Text = function(config) {
        this.___init(config);
    };
    function _fillFunc(context) {
        context.fillText(this.partialText, 0, 0);
    }
    function _strokeFunc(context) {
        context.strokeText(this.partialText, 0, 0);
    }

    Kinetic.Text.prototype = {
        ___init: function(config) {
            var that = this;

            if (config.width === undefined) {
                config.width = AUTO;
            }
            if (config.height === undefined) {
                config.height = AUTO;
            }

            // call super constructor
            Kinetic.Shape.call(this, config);

            this._fillFunc = _fillFunc;
            this._strokeFunc = _strokeFunc;
            this.className = TEXT_UPPER;

            // update text data for certain attr changes
            for(var n = 0; n < attrChangeListLen; n++) {
                this.on(ATTR_CHANGE_LIST[n] + CHANGE_KINETIC, that._setTextData);
            }

            this._setTextData();
            this.sceneFunc(this._sceneFunc);
            this.hitFunc(this._hitFunc);
        },
        _sceneFunc: function(context) {
            var p = this.getPadding(),
                textHeight = this.getTextHeight(),
                lineHeightPx = this.getLineHeight() * textHeight,
                textArr = this.textArr,
                textArrLen = textArr.length,
                totalWidth = this.getWidth(),
                n;

            context.setAttr('font', this._getContextFont());
            context.setAttr('textBaseline', MIDDLE);
            context.setAttr('textAlign', LEFT);
            context.save();
            context.translate(p, 0);
            context.translate(0, p + textHeight / 2);

            // draw text lines
            for(n = 0; n < textArrLen; n++) {
                var obj = textArr[n],
                    text = obj.text,
                    width = obj.width;

                // horizontal alignment
                context.save();
                if(this.getAlign() === RIGHT) {
                    context.translate(totalWidth - width - p * 2, 0);
                }
                else if(this.getAlign() === CENTER) {
                    context.translate((totalWidth - width - p * 2) / 2, 0);
                }

                this.partialText = text;
                context.fillStrokeShape(this);
                context.restore();
                context.translate(0, lineHeightPx);
            }
            context.restore();
        },
        _hitFunc: function(context) {
            var width = this.getWidth(),
                height = this.getHeight();

            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            context.fillStrokeShape(this);
        },
        setText: function(text) {
            var str = Kinetic.Util._isString(text) ? text : text.toString();
            this._setAttr(TEXT, str);
            return this;
        },
        /**
         * get width of text area, which includes padding
         * @method
         * @memberof Kinetic.Text.prototype
         * @returns {Number}
         */
        getWidth: function() {
            return this.attrs.width === AUTO ? this.getTextWidth() + this.getPadding() * 2 : this.attrs.width;
        },
        /**
         * get the height of the text area, which takes into account multi-line text, line heights, and padding
         * @method
         * @memberof Kinetic.Text.prototype
         * @returns {Number}
         */
        getHeight: function() {
            return this.attrs.height === AUTO ? (this.getTextHeight() * this.textArr.length * this.getLineHeight()) + this.getPadding() * 2 : this.attrs.height;
        },
        /**
         * get text width
         * @method
         * @memberof Kinetic.Text.prototype
         * @returns {Number}
         */
        getTextWidth: function() {
            return this.textWidth;
        },
        /**
         * get text height
         * @method
         * @memberof Kinetic.Text.prototype
         * @returns {Number}
         */
        getTextHeight: function() {
            return this.textHeight;
        },
        _getTextSize: function(text) {
            var _context = dummyContext,
                fontSize = this.getFontSize(),
                metrics;

            _context.save();
            _context.font = this._getContextFont();

            metrics = _context.measureText(text);
            _context.restore();
            return {
                width: metrics.width,
                height: parseInt(fontSize, 10)
            };
        },
        _getContextFont: function() {
            return this.getFontStyle() + SPACE + this.getFontVariant() + SPACE + this.getFontSize() + PX_SPACE + this.getFontFamily();
        },
        _addTextLine: function (line, width) {
            return this.textArr.push({text: line, width: width});
        },
        _getTextWidth: function (text) {
            return dummyContext.measureText(text).width;
        },
        _setTextData: function () {
            var lines = this.getText().split('\n'),
                fontSize = +this.getFontSize(),
                textWidth = 0,
                lineHeightPx = this.getLineHeight() * fontSize,
                width = this.attrs.width,
                height = this.attrs.height,
                fixedWidth = width !== AUTO,
                fixedHeight = height !== AUTO,
                padding = this.getPadding(),
                maxWidth = width - padding * 2,
                maxHeightPx = height - padding * 2,
                currentHeightPx = 0,
                wrap = this.getWrap(),
                shouldWrap = wrap !== NONE,
                wrapAtWord = wrap !==  CHAR && shouldWrap;

            this.textArr = [];
            dummyContext.save();
            dummyContext.font = this._getContextFont();
            for (var i = 0, max = lines.length; i < max; ++i) {
                var line = lines[i],
                    lineWidth = this._getTextWidth(line);
                if (fixedWidth && lineWidth > maxWidth) {
                    /*
                     * if width is fixed and line does not fit entirely
                     * break the line into multiple fitting lines
                     */
                    while (line.length > 0) {
                        /*
                         * use binary search to find the longest substring that
                         * that would fit in the specified width
                         */
                        var low = 0, high = line.length,
                            match = '', matchWidth = 0;
                        while (low < high) {
                            var mid = (low + high) >>> 1,
                                substr = line.slice(0, mid + 1),
                                substrWidth = this._getTextWidth(substr);
                            if (substrWidth <= maxWidth) {
                                low = mid + 1;
                                match = substr;
                                matchWidth = substrWidth;
                            } else {
                                high = mid;
                            }
                        }
                        /*
                         * 'low' is now the index of the substring end
                         * 'match' is the substring
                         * 'matchWidth' is the substring width in px
                         */
                        if (match) {
                            // a fitting substring was found
                            if (wrapAtWord) {
                                // try to find a space or dash where wrapping could be done
                                var wrapIndex = Math.max(match.lastIndexOf(SPACE),
                                                          match.lastIndexOf(DASH)) + 1;
                                if (wrapIndex > 0) {
                                    // re-cut the substring found at the space/dash position
                                    low = wrapIndex;
                                    match = match.slice(0, low);
                                    matchWidth = this._getTextWidth(match);
                                }
                            }
                            this._addTextLine(match, matchWidth);
                            textWidth = Math.max(textWidth, matchWidth);
                            currentHeightPx += lineHeightPx;
                            if (!shouldWrap ||
                                (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx)) {
                                /*
                                 * stop wrapping if wrapping is disabled or if adding
                                 * one more line would overflow the fixed height
                                 */
                                break;
                            }
                            line = line.slice(low);
                            if (line.length > 0) {
                                // Check if the remaining text would fit on one line
                                lineWidth = this._getTextWidth(line);
                                if (lineWidth <= maxWidth) {
                                    // if it does, add the line and break out of the loop
                                    this._addTextLine(line, lineWidth);
                                    currentHeightPx += lineHeightPx;
                                    textWidth = Math.max(textWidth, lineWidth);
                                    break;
                                }
                            }
                        } else {
                            // not even one character could fit in the element, abort
                            break;
                        }
                    }
                } else {
                    // element width is automatically adjusted to max line width
                    this._addTextLine(line, lineWidth);
                    currentHeightPx += lineHeightPx;
                    textWidth = Math.max(textWidth, lineWidth);
                }
                // if element height is fixed, abort if adding one more line would overflow
                if (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx) {
                    break;
                }
            }
            dummyContext.restore();
            this.textHeight = fontSize;
            this.textWidth = textWidth;
        }
    };
    Kinetic.Util.extend(Kinetic.Text, Kinetic.Shape);

    // add getters setters
    Kinetic.Factory.addGetterSetter(Kinetic.Text, 'fontFamily', 'Arial');

    /**
     * get/set font family
     * @name fontFamily
     * @method
     * @memberof Kinetic.Text.prototype
     * @param {String} fontFamily
     * @returns {String}
     * @example
     * // get font family
     * var fontFamily = text.fontFamily();
     *
     * // set font family
     * text.fontFamily('Arial');
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Text, 'fontSize', 12);

    /**
     * get/set font size in pixels
     * @name fontSize
     * @method
     * @memberof Kinetic.Text.prototype
     * @param {Number} fontSize
     * @returns {Number}
     * @example
     * // get font size
     * var fontSize = text.fontSize();
     *
     * // set font size to 22px
     * text.fontSize(22);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Text, 'fontStyle', NORMAL);

    /**
     * set font style.  Can be 'normal', 'italic', or 'bold'.  'normal' is the default.
     * @name fontStyle
     * @method
     * @memberof Kinetic.Text.prototype
     * @param {String} fontStyle
     * @returns {String}
     * @example
     * // get font style
     * var fontStyle = text.fontStyle();
     *
     * // set font style
     * text.fontStyle('bold');
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Text, 'fontVariant', NORMAL);

    /**
     * set font variant.  Can be 'normal' or 'small-caps'.  'normal' is the default.
     * @name fontVariant
     * @method
     * @memberof Kinetic.Text.prototype
     * @param {String} fontVariant
     * @returns {String}
     * @example
     * // get font variant
     * var fontVariant = text.fontVariant();
     *
     * // set font variant
     * text.fontVariant('small-caps');
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Text, 'padding', 0);

    /**
     * set padding
     * @name padding
     * @method
     * @memberof Kinetic.Text.prototype
     * @param {Number} padding
     * @returns {Number}
     * @example
     * // get padding
     * var padding = text.padding();
     *
     * // set padding to 10 pixels
     * text.padding(10);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Text, 'align', LEFT);

    /**
     * get/set horizontal align of text.  Can be 'left', 'center', or 'right'
     * @name align
     * @method
     * @memberof Kinetic.Text.prototype
     * @param {String} align
     * @returns {String}
     * @example
     * // get text align
     * var align = text.align();
     *
     * // center text
     * text.align('center');
     *
     * // align text to right
     * text.align('right');
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Text, 'lineHeight', 1);

    /**
     * get/set line height.  The default is 1.
     * @name lineHeight
     * @method
     * @memberof Kinetic.Text.prototype
     * @param {Number} lineHeight
     * @returns {Number}
     * @example
     * // get line height
     * var lineHeight = text.lineHeight();
     *
     * // set the line height
     * text.lineHeight(2);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Text, 'wrap', WORD);

    /**
     * get/set wrap.  Can be word, char, or none. Default is word.
     * @name wrap
     * @method
     * @memberof Kinetic.Text.prototype
     * @param {String} wrap
     * @returns {String}
     * @example
     * // get wrap
     * var wrap = text.wrap();
     *
     * // set wrap
     * text.wrap('word');
     */

    Kinetic.Factory.addGetter(Kinetic.Text, 'text', EMPTY_STRING);
    Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Text, 'text');

    /**
     * get/set text
     * @name getText
     * @method
     * @memberof Kinetic.Text.prototype
     * @param {String} text
     * @returns {String}
     * @example
     * // get text
     * var text = text.text();
     *
     * // set text
     * text.text('Hello world!');
     */

    Kinetic.Collection.mapMethods(Kinetic.Text);
})();
;(function() {
    /**
     * Line constructor.&nbsp; Lines are defined by an array of points and
     *  a tension
     * @constructor
     * @memberof Kinetic
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Array} config.points
     * @param {Number} [config.tension] Higher values will result in a more curvy line.  A value of 0 will result in no interpolation.
     *   The default is 0
     * @param {Boolean} [config.closed] defines whether or not the line shape is closed, creating a polygon or blob
     * @param {String} [config.fill] fill color
     * @param {Integer} [config.fillRed] set fill red component
     * @param {Integer} [config.fillGreen] set fill green component
     * @param {Integer} [config.fillBlue] set fill blue component
     * @param {Integer} [config.fillAlpha] set fill alpha component
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX]
     * @param {Number} [config.fillPatternOffsetY]
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX]
     * @param {Number} [config.fillRadialGradientEndPointY]
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Integer} [config.strokeRed] set stroke red component
     * @param {Integer} [config.strokeGreen] set stroke green component
     * @param {Integer} [config.strokeBlue] set stroke blue component
     * @param {Integer} [config.strokeAlpha] set stroke alpha component
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Integer} [config.shadowRed] set shadow color red component
     * @param {Integer} [config.shadowGreen] set shadow color green component
     * @param {Integer} [config.shadowBlue] set shadow color blue component
     * @param {Integer} [config.shadowAlpha] set shadow color alpha component
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var line = new Kinetic.Line({
     *   x: 100,
     *   y: 50,
     *   points: [73, 70, 340, 23, 450, 60, 500, 20],
     *   stroke: 'red',
     *   tension: 1
     * });
     */
    Kinetic.Line = function(config) {
        this.___init(config);
    };

    Kinetic.Line.prototype = {
        ___init: function(config) {
            // call super constructor
            Kinetic.Shape.call(this, config);
            this.className = 'Line';

            this.on('pointsChange.kinetic tensionChange.kinetic closedChange.kinetic', function() {
                this._clearCache('tensionPoints');
            });

            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            var points = this.getPoints(),
                length = points.length,
                tension = this.getTension(),
                closed = this.getClosed(),
                tp, len, n;

            context.beginPath();
            context.moveTo(points[0], points[1]);

            // tension
            if(tension !== 0 && length > 4) {
                tp = this.getTensionPoints();
                len = tp.length;
                n = closed ? 0 : 4;

                if (!closed) {
                    context.quadraticCurveTo(tp[0], tp[1], tp[2], tp[3]);
                }

                while(n < len - 2) {
                    context.bezierCurveTo(tp[n++], tp[n++], tp[n++], tp[n++], tp[n++], tp[n++]);
                }

                if (!closed) {
                    context.quadraticCurveTo(tp[len-2], tp[len-1], points[length-2], points[length-1]);
                }
            }
            // no tension
            else {
                for(n = 2; n < length; n+=2) {
                    context.lineTo(points[n], points[n+1]);
                }
            }

            // closed e.g. polygons and blobs
            if (closed) {
                context.closePath();
                context.fillStrokeShape(this);
            }
            // open e.g. lines and splines
            else {
                context.strokeShape(this);
            }
        },
        getTensionPoints: function() {
            return this._getCache('tensionPoints', this._getTensionPoints);
        },
        _getTensionPoints: function() {
            if (this.getClosed()) {
                return this._getTensionPointsClosed();
            }
            else {
                return Kinetic.Util._expandPoints(this.getPoints(), this.getTension());
            }
        },
        _getTensionPointsClosed: function() {
            var p = this.getPoints(),
                len = p.length,
                tension = this.getTension(),
                util = Kinetic.Util,
                firstControlPoints = util._getControlPoints(
                    p[len-2],
                    p[len-1],
                    p[0],
                    p[1],
                    p[2],
                    p[3],
                    tension
                ),
                lastControlPoints = util._getControlPoints(
                    p[len-4],
                    p[len-3],
                    p[len-2],
                    p[len-1],
                    p[0],
                    p[1],
                    tension
                ),
                middle = Kinetic.Util._expandPoints(p, tension),
                tp = [
                    firstControlPoints[2],
                    firstControlPoints[3]
                ]
                .concat(middle)
                .concat([
                    lastControlPoints[0],
                    lastControlPoints[1],
                    p[len-2],
                    p[len-1],
                    lastControlPoints[2],
                    lastControlPoints[3],
                    firstControlPoints[0],
                    firstControlPoints[1],
                    p[0],
                    p[1]
                ]);

            return tp;
        }
    };
    Kinetic.Util.extend(Kinetic.Line, Kinetic.Shape);

    // add getters setters
    Kinetic.Factory.addGetterSetter(Kinetic.Line, 'closed', false);

    /**
     * get/set closed flag.  The default is false
     * @name closed
     * @method
     * @memberof Kinetic.Line.prototype
     * @param {Boolean} closed
     * @returns {Boolean}
     * @example
     * // get closed flag
     * var closed = line.closed();
     *
     * // close the shape
     * line.closed(true);
     *
     * // open the shape
     * line.closed(false);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Line, 'tension', 0);

    /**
     * get/set tension
     * @name tension
     * @method
     * @memberof Kinetic.Line.prototype
     * @param {Number} Higher values will result in a more curvy line.  A value of 0 will result in no interpolation.
     *   The default is 0
     * @returns {Number}
     * @example
     * // get tension
     * var tension = line.tension();
     *
     * // set tension
     * line.tension(3);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Line, 'points');
    /**
     * get/set points array
     * @name points
     * @method
     * @memberof Kinetic.Line.prototype
     * @param {Array} points
     * @returns {Array}
     * @example
     * // get points
     * var points = line.points();
     *
     * // set points
     * line.points([10, 20, 30, 40, 50, 60]);
     *
     * // push a new point
     * line.points(line.points().concat([70, 80]));
     */

    Kinetic.Collection.mapMethods(Kinetic.Line);
})();;(function() {
    /**
     * Sprite constructor
     * @constructor
     * @memberof Kinetic
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {String} config.animation animation key
     * @param {Object} config.animations animation map
     * @param {Integer} [config.frameIndex] animation frame index
     * @param {Image} config.image image object
     * @param {String} [config.fill] fill color
     * @param {Integer} [config.fillRed] set fill red component
     * @param {Integer} [config.fillGreen] set fill green component
     * @param {Integer} [config.fillBlue] set fill blue component
     * @param {Integer} [config.fillAlpha] set fill alpha component
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX]
     * @param {Number} [config.fillPatternOffsetY]
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX]
     * @param {Number} [config.fillRadialGradientEndPointY]
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Integer} [config.strokeRed] set stroke red component
     * @param {Integer} [config.strokeGreen] set stroke green component
     * @param {Integer} [config.strokeBlue] set stroke blue component
     * @param {Integer} [config.strokeAlpha] set stroke alpha component
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Integer} [config.shadowRed] set shadow color red component
     * @param {Integer} [config.shadowGreen] set shadow color green component
     * @param {Integer} [config.shadowBlue] set shadow color blue component
     * @param {Integer} [config.shadowAlpha] set shadow color alpha component
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var imageObj = new Image();
     * imageObj.onload = function() {
     *   var sprite = new Kinetic.Sprite({
     *     x: 200,
     *     y: 100,
     *     image: imageObj,
     *     animation: 'standing',
     *     animations: {
     *       standing: [
     *         // x, y, width, height (6 frames)
     *         0, 0, 49, 109,
     *         52, 0, 49, 109,
     *         105, 0, 49, 109,
     *         158, 0, 49, 109,
     *         210, 0, 49, 109,
     *         262, 0, 49, 109
     *       ],
     *       kicking: [
     *         // x, y, width, height (6 frames)
     *         0, 109, 45, 98,
     *         45, 109, 45, 98,
     *         95, 109, 63, 98,
     *         156, 109, 70, 98,
     *         229, 109, 60, 98,
     *         287, 109, 41, 98
     *       ]
     *     },
     *     frameRate: 7,
     *     frameIndex: 0
     *   });
     * };
     * imageObj.src = '/path/to/image.jpg'
     */
    Kinetic.Sprite = function(config) {
        this.___init(config);
    };

    Kinetic.Sprite.prototype = {
        ___init: function(config) {
            // call super constructor
            Kinetic.Shape.call(this, config);
            this.className = 'Sprite';

            this._updated = true;
            var that = this;
            this.anim = new Kinetic.Animation(function() {
                // if we don't need to redraw layer we should return false
                var updated = that._updated;
                that._updated = false;
                return updated;
            });
            this.on('animationChange.kinetic', function() {
                // reset index when animation changes
                this.frameIndex(0);
            });
            this.on('frameIndexChange.kinetic', function() {
                this._updated = true;
            });
            // smooth change for frameRate
            this.on('frameRateChange.kinetic', function() {
                if (!this.anim.isRunning()) {
                    return;
                }
                clearInterval(this.interval);
                this._setInterval();
            });

            this.sceneFunc(this._sceneFunc);
            this.hitFunc(this._hitFunc);
        },
        _sceneFunc: function(context) {
            var anim = this.getAnimation(),
                index = this.frameIndex(),
                ix4 = index * 4,
                set = this.getAnimations()[anim],
                x =      set[ix4 + 0],
                y =      set[ix4 + 1],
                width =  set[ix4 + 2],
                height = set[ix4 + 3],
                image = this.getImage();

            if(image) {
                context.drawImage(image, x, y, width, height, 0, 0, width, height);
            }
        },
        _hitFunc: function(context) {
            var anim = this.getAnimation(),
                index = this.frameIndex(),
                ix4 = index * 4,
                set = this.getAnimations()[anim],
                width =  set[ix4 + 2],
                height = set[ix4 + 3];

            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            context.fillShape(this);
        },
        _useBufferCanvas: function() {
            return (this.hasShadow() || this.getAbsoluteOpacity() !== 1) && this.hasStroke();
        },
        _setInterval: function() {
            var that = this;
            this.interval = setInterval(function() {
                that._updateIndex();
            }, 1000 / this.getFrameRate());
        },
        /**
         * start sprite animation
         * @method
         * @memberof Kinetic.Sprite.prototype
         */
        start: function() {
            var layer = this.getLayer();

            /*
             * animation object has no executable function because
             *  the updates are done with a fixed FPS with the setInterval
             *  below.  The anim object only needs the layer reference for
             *  redraw
             */
            this.anim.setLayers(layer);
            this._setInterval();
            this.anim.start();
        },
        /**
         * stop sprite animation
         * @method
         * @memberof Kinetic.Sprite.prototype
         */
        stop: function() {
            this.anim.stop();
            clearInterval(this.interval);
        },
        /**
         * determine if animation of sprite is running or not.  returns true or false
         * @method
         * @memberof Kinetic.Animation.prototype
         * @returns {Boolean}
         */
        isRunning: function() {
            return this.anim.isRunning();
        },
        _updateIndex: function() {
            var index = this.frameIndex(),
                animation = this.getAnimation(),
                animations = this.getAnimations(),
                anim = animations[animation],
                len = anim.length / 4;

            if(index < len - 1) {
                this.frameIndex(index + 1);
            }
            else {
                this.frameIndex(0);
            }
        }
    };
    Kinetic.Util.extend(Kinetic.Sprite, Kinetic.Shape);

    // add getters setters
    Kinetic.Factory.addGetterSetter(Kinetic.Sprite, 'animation');

    /**
     * get/set animation key
     * @name animation
     * @method
     * @memberof Kinetic.Sprite.prototype
     * @param {String} anim animation key
     * @returns {String}
     * @example
     * // get animation key
     * var animation = sprite.animation();
     *
     * // set animation key
     * sprite.animation('kicking');
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Sprite, 'animations');

    /**
     * get/set animations map
     * @name animations
     * @method
     * @memberof Kinetic.Sprite.prototype
     * @param {Object} animations
     * @returns {Object}
     * @example
     * // get animations map
     * var animations = sprite.animations();
     *
     * // set animations map
     * sprite.animations({
     *   standing: [
     *     // x, y, width, height (6 frames)
     *     0, 0, 49, 109,
     *     52, 0, 49, 109,
     *     105, 0, 49, 109,
     *     158, 0, 49, 109,
     *     210, 0, 49, 109,
     *     262, 0, 49, 109
     *   ],
     *   kicking: [
     *     // x, y, width, height (6 frames)
     *     0, 109, 45, 98,
     *     45, 109, 45, 98,
     *     95, 109, 63, 98,
     *     156, 109, 70, 98,
     *     229, 109, 60, 98,
     *     287, 109, 41, 98
     *   ]
     * });
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Sprite, 'image');

    /**
     * get/set image
     * @name image
     * @method
     * @memberof Kinetic.Sprite.prototype
     * @param {Image} image
     * @returns {Image}
     * @example
     * // get image
     * var image = sprite.image();
     *
     * // set image
     * sprite.image(imageObj);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Sprite, 'frameIndex', 0);

    /**
     * set/set animation frame index
     * @name frameIndex
     * @method
     * @memberof Kinetic.Sprite.prototype
     * @param {Integer} frameIndex
     * @returns {Integer}
     * @example
     * // get animation frame index
     * var frameIndex = sprite.frameIndex();
     *
     * // set animation frame index
     * sprite.frameIndex(3);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Sprite, 'frameRate', 17);

    /**
     * get/set frame rate in frames per second.  Increase this number to make the sprite
     *  animation run faster, and decrease the number to make the sprite animation run slower
     *  The default is 17 frames per second
     * @name frameRate
     * @method
     * @memberof Kinetic.Sprite.prototype
     * @param {Integer} frameRate
     * @returns {Integer}
     * @example
     * // get frame rate
     * var frameRate = sprite.frameRate();
     *
     * // set frame rate to 2 frames per second
     * sprite.frameRate(2);
     */

    Kinetic.Factory.backCompat(Kinetic.Sprite, {
        index: 'frameIndex',
        getIndex: 'getFrameIndex',
        setIndex: 'setFrameIndex'
    });

    Kinetic.Collection.mapMethods(Kinetic.Sprite);
})();
;(function () {
    /**
     * Path constructor.
     * @author Jason Follas
     * @constructor
     * @memberof Kinetic
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {String} config.data SVG data string
     * @param {String} [config.fill] fill color
     * @param {Integer} [config.fillRed] set fill red component
     * @param {Integer} [config.fillGreen] set fill green component
     * @param {Integer} [config.fillBlue] set fill blue component
     * @param {Integer} [config.fillAlpha] set fill alpha component
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX]
     * @param {Number} [config.fillPatternOffsetY]
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX]
     * @param {Number} [config.fillRadialGradientEndPointY]
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Integer} [config.strokeRed] set stroke red component
     * @param {Integer} [config.strokeGreen] set stroke green component
     * @param {Integer} [config.strokeBlue] set stroke blue component
     * @param {Integer} [config.strokeAlpha] set stroke alpha component
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Integer} [config.shadowRed] set shadow color red component
     * @param {Integer} [config.shadowGreen] set shadow color green component
     * @param {Integer} [config.shadowBlue] set shadow color blue component
     * @param {Integer} [config.shadowAlpha] set shadow color alpha component
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var path = new Kinetic.Path({
     *   x: 240,
     *   y: 40,
     *   data: 'M12.582,9.551C3.251,16.237,0.921,29.021,7.08,38.564l-2.36,1.689l4.893,2.262l4.893,2.262l-0.568-5.36l-0.567-5.359l-2.365,1.694c-4.657-7.375-2.83-17.185,4.352-22.33c7.451-5.338,17.817-3.625,23.156,3.824c5.337,7.449,3.625,17.813-3.821,23.152l2.857,3.988c9.617-6.893,11.827-20.277,4.935-29.896C35.591,4.87,22.204,2.658,12.582,9.551z',
     *   fill: 'green',
     *   scale: 2
     * });
     */
    Kinetic.Path = function (config) {
        this.___init(config);
    };

    Kinetic.Path.prototype = {
        ___init: function (config) {
            this.dataArray = [];
            var that = this;

            // call super constructor
            Kinetic.Shape.call(this, config);
            this.className = 'Path';

            this.dataArray = Kinetic.Path.parsePathData(this.getData());
            this.on('dataChange.kinetic', function () {
                that.dataArray = Kinetic.Path.parsePathData(this.getData());
            });

            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            var ca = this.dataArray,
                closedPath = false;

            // context position
            context.beginPath();
            for (var n = 0; n < ca.length; n++) {
                var c = ca[n].command;
                var p = ca[n].points;
                switch (c) {
                    case 'L':
                        context.lineTo(p[0], p[1]);
                        break;
                    case 'M':
                        context.moveTo(p[0], p[1]);
                        break;
                    case 'C':
                        context.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
                        break;
                    case 'Q':
                        context.quadraticCurveTo(p[0], p[1], p[2], p[3]);
                        break;
                    case 'A':
                        var cx = p[0], cy = p[1], rx = p[2], ry = p[3], theta = p[4], dTheta = p[5], psi = p[6], fs = p[7];

                        var r = (rx > ry) ? rx : ry;
                        var scaleX = (rx > ry) ? 1 : rx / ry;
                        var scaleY = (rx > ry) ? ry / rx : 1;

                        context.translate(cx, cy);
                        context.rotate(psi);
                        context.scale(scaleX, scaleY);
                        context.arc(0, 0, r, theta, theta + dTheta, 1 - fs);
                        context.scale(1 / scaleX, 1 / scaleY);
                        context.rotate(-psi);
                        context.translate(-cx, -cy);

                        break;
                    case 'z':
                        context.closePath();
                        closedPath = true;
                        break;
                }
            }

            if (closedPath) {
                context.fillStrokeShape(this);
            }
            else {
                context.strokeShape(this);
            }
        }
    };
    Kinetic.Util.extend(Kinetic.Path, Kinetic.Shape);

    Kinetic.Path.getLineLength = function(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    };
    Kinetic.Path.getPointOnLine = function(dist, P1x, P1y, P2x, P2y, fromX, fromY) {
        if(fromX === undefined) {
            fromX = P1x;
        }
        if(fromY === undefined) {
            fromY = P1y;
        }

        var m = (P2y - P1y) / ((P2x - P1x) + 0.00000001);
        var run = Math.sqrt(dist * dist / (1 + m * m));
        if(P2x < P1x) {
            run *= -1;
        }
        var rise = m * run;
        var pt;

        if (P2x === P1x) { // vertical line
            pt = {
                x: fromX,
                y: fromY + rise
            };
        } else if((fromY - P1y) / ((fromX - P1x) + 0.00000001) === m) {
            pt = {
                x: fromX + run,
                y: fromY + rise
            };
        }
        else {
            var ix, iy;

            var len = this.getLineLength(P1x, P1y, P2x, P2y);
            if(len < 0.00000001) {
                return undefined;
            }
            var u = (((fromX - P1x) * (P2x - P1x)) + ((fromY - P1y) * (P2y - P1y)));
            u = u / (len * len);
            ix = P1x + u * (P2x - P1x);
            iy = P1y + u * (P2y - P1y);

            var pRise = this.getLineLength(fromX, fromY, ix, iy);
            var pRun = Math.sqrt(dist * dist - pRise * pRise);
            run = Math.sqrt(pRun * pRun / (1 + m * m));
            if(P2x < P1x) {
                run *= -1;
            }
            rise = m * run;
            pt = {
                x: ix + run,
                y: iy + rise
            };
        }

        return pt;
    };

    Kinetic.Path.getPointOnCubicBezier = function(pct, P1x, P1y, P2x, P2y, P3x, P3y, P4x, P4y) {
        function CB1(t) {
            return t * t * t;
        }
        function CB2(t) {
            return 3 * t * t * (1 - t);
        }
        function CB3(t) {
            return 3 * t * (1 - t) * (1 - t);
        }
        function CB4(t) {
            return (1 - t) * (1 - t) * (1 - t);
        }
        var x = P4x * CB1(pct) + P3x * CB2(pct) + P2x * CB3(pct) + P1x * CB4(pct);
        var y = P4y * CB1(pct) + P3y * CB2(pct) + P2y * CB3(pct) + P1y * CB4(pct);

        return {
            x: x,
            y: y
        };
    };
    Kinetic.Path.getPointOnQuadraticBezier = function(pct, P1x, P1y, P2x, P2y, P3x, P3y) {
        function QB1(t) {
            return t * t;
        }
        function QB2(t) {
            return 2 * t * (1 - t);
        }
        function QB3(t) {
            return (1 - t) * (1 - t);
        }
        var x = P3x * QB1(pct) + P2x * QB2(pct) + P1x * QB3(pct);
        var y = P3y * QB1(pct) + P2y * QB2(pct) + P1y * QB3(pct);

        return {
            x: x,
            y: y
        };
    };
    Kinetic.Path.getPointOnEllipticalArc = function(cx, cy, rx, ry, theta, psi) {
        var cosPsi = Math.cos(psi), sinPsi = Math.sin(psi);
        var pt = {
            x: rx * Math.cos(theta),
            y: ry * Math.sin(theta)
        };
        return {
            x: cx + (pt.x * cosPsi - pt.y * sinPsi),
            y: cy + (pt.x * sinPsi + pt.y * cosPsi)
        };
    };
    /*
     * get parsed data array from the data
     *  string.  V, v, H, h, and l data are converted to
     *  L data for the purpose of high performance Path
     *  rendering
     */
    Kinetic.Path.parsePathData = function(data) {
        // Path Data Segment must begin with a moveTo
        //m (x y)+  Relative moveTo (subsequent points are treated as lineTo)
        //M (x y)+  Absolute moveTo (subsequent points are treated as lineTo)
        //l (x y)+  Relative lineTo
        //L (x y)+  Absolute LineTo
        //h (x)+    Relative horizontal lineTo
        //H (x)+    Absolute horizontal lineTo
        //v (y)+    Relative vertical lineTo
        //V (y)+    Absolute vertical lineTo
        //z (closepath)
        //Z (closepath)
        //c (x1 y1 x2 y2 x y)+ Relative Bezier curve
        //C (x1 y1 x2 y2 x y)+ Absolute Bezier curve
        //q (x1 y1 x y)+       Relative Quadratic Bezier
        //Q (x1 y1 x y)+       Absolute Quadratic Bezier
        //t (x y)+    Shorthand/Smooth Relative Quadratic Bezier
        //T (x y)+    Shorthand/Smooth Absolute Quadratic Bezier
        //s (x2 y2 x y)+       Shorthand/Smooth Relative Bezier curve
        //S (x2 y2 x y)+       Shorthand/Smooth Absolute Bezier curve
        //a (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+     Relative Elliptical Arc
        //A (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+  Absolute Elliptical Arc

        // return early if data is not defined
        if(!data) {
            return [];
        }

        // command string
        var cs = data;

        // command chars
        var cc = ['m', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z', 'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'];
        // convert white spaces to commas
        cs = cs.replace(new RegExp(' ', 'g'), ',');
        // create pipes so that we can split the data
        for(var n = 0; n < cc.length; n++) {
            cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
        }
        // create array
        var arr = cs.split('|');
        var ca = [];
        // init context point
        var cpx = 0;
        var cpy = 0;
        for( n = 1; n < arr.length; n++) {
            var str = arr[n];
            var c = str.charAt(0);
            str = str.slice(1);
            // remove ,- for consistency
            str = str.replace(new RegExp(',-', 'g'), '-');
            // add commas so that it's easy to split
            str = str.replace(new RegExp('-', 'g'), ',-');
            str = str.replace(new RegExp('e,-', 'g'), 'e-');
            var p = str.split(',');
            if(p.length > 0 && p[0] === '') {
                p.shift();
            }
            // convert strings to floats
            for(var i = 0; i < p.length; i++) {
                p[i] = parseFloat(p[i]);
            }
            while(p.length > 0) {
                if(isNaN(p[0])) {// case for a trailing comma before next command
                    break;
                }

                var cmd = null;
                var points = [];
                var startX = cpx, startY = cpy;
                // Move var from within the switch to up here (jshint)
                var prevCmd, ctlPtx, ctlPty;     // Ss, Tt
                var rx, ry, psi, fa, fs, x1, y1; // Aa


                // convert l, H, h, V, and v to L
                switch (c) {

                    // Note: Keep the lineTo's above the moveTo's in this switch
                    case 'l':
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'L':
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;

                    // Note: lineTo handlers need to be above this point
                    case 'm':
                        var dx = p.shift();
                        var dy = p.shift();
                        cpx += dx;
                        cpy += dy;
                        cmd = 'M';
                        // After closing the path move the current position
                        // to the the first point of the path (if any).
                        if(ca.length>2 && ca[ca.length-1].command==='z'){
                            for(var idx=ca.length-2;idx>=0;idx--){
                                if(ca[idx].command==='M'){
                                    cpx=ca[idx].points[0]+dx;
                                    cpy=ca[idx].points[1]+dy;
                                    break;
                                }
                            }
                        }
                        points.push(cpx, cpy);
                        c = 'l';
                        // subsequent points are treated as relative lineTo
                        break;
                    case 'M':
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'M';
                        points.push(cpx, cpy);
                        c = 'L';
                        // subsequent points are treated as absolute lineTo
                        break;

                    case 'h':
                        cpx += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'H':
                        cpx = p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'v':
                        cpy += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'V':
                        cpy = p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'C':
                        points.push(p.shift(), p.shift(), p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'c':
                        points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 'S':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if(prevCmd.command === 'C') {
                            ctlPtx = cpx + (cpx - prevCmd.points[2]);
                            ctlPty = cpy + (cpy - prevCmd.points[3]);
                        }
                        points.push(ctlPtx, ctlPty, p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 's':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if(prevCmd.command === 'C') {
                            ctlPtx = cpx + (cpx - prevCmd.points[2]);
                            ctlPty = cpy + (cpy - prevCmd.points[3]);
                        }
                        points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 'Q':
                        points.push(p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'q':
                        points.push(cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'Q';
                        points.push(cpx, cpy);
                        break;
                    case 'T':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if(prevCmd.command === 'Q') {
                            ctlPtx = cpx + (cpx - prevCmd.points[0]);
                            ctlPty = cpy + (cpy - prevCmd.points[1]);
                        }
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'Q';
                        points.push(ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 't':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if(prevCmd.command === 'Q') {
                            ctlPtx = cpx + (cpx - prevCmd.points[0]);
                            ctlPty = cpy + (cpy - prevCmd.points[1]);
                        }
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'Q';
                        points.push(ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 'A':
                        rx = p.shift();
                        ry = p.shift();
                        psi = p.shift();
                        fa = p.shift();
                        fs = p.shift();
                        x1 = cpx;
                        y1 = cpy;
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'A';
                        points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                        break;
                    case 'a':
                        rx = p.shift();
                        ry = p.shift();
                        psi = p.shift();
                        fa = p.shift();
                        fs = p.shift();
                        x1 = cpx;
                        y1 = cpy; cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'A';
                        points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                        break;
                }

                ca.push({
                    command: cmd || c,
                    points: points,
                    start: {
                        x: startX,
                        y: startY
                    },
                    pathLength: this.calcLength(startX, startY, cmd || c, points)
                });
            }

            if(c === 'z' || c === 'Z') {
                ca.push({
                    command: 'z',
                    points: [],
                    start: undefined,
                    pathLength: 0
                });
            }
        }

        return ca;
    };
    Kinetic.Path.calcLength = function(x, y, cmd, points) {
        var len, p1, p2, t;
        var path = Kinetic.Path;

        switch (cmd) {
            case 'L':
                return path.getLineLength(x, y, points[0], points[1]);
            case 'C':
                // Approximates by breaking curve into 100 line segments
                len = 0.0;
                p1 = path.getPointOnCubicBezier(0, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
                for( t = 0.01; t <= 1; t += 0.01) {
                    p2 = path.getPointOnCubicBezier(t, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
                    len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                    p1 = p2;
                }
                return len;
            case 'Q':
                // Approximates by breaking curve into 100 line segments
                len = 0.0;
                p1 = path.getPointOnQuadraticBezier(0, x, y, points[0], points[1], points[2], points[3]);
                for( t = 0.01; t <= 1; t += 0.01) {
                    p2 = path.getPointOnQuadraticBezier(t, x, y, points[0], points[1], points[2], points[3]);
                    len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                    p1 = p2;
                }
                return len;
            case 'A':
                // Approximates by breaking curve into line segments
                len = 0.0;
                var start = points[4];
                // 4 = theta
                var dTheta = points[5];
                // 5 = dTheta
                var end = points[4] + dTheta;
                var inc = Math.PI / 180.0;
                // 1 degree resolution
                if(Math.abs(start - end) < inc) {
                    inc = Math.abs(start - end);
                }
                // Note: for purpose of calculating arc length, not going to worry about rotating X-axis by angle psi
                p1 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], start, 0);
                if(dTheta < 0) {// clockwise
                    for( t = start - inc; t > end; t -= inc) {
                        p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                        len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                        p1 = p2;
                    }
                }
                else {// counter-clockwise
                    for( t = start + inc; t < end; t += inc) {
                        p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                        len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                        p1 = p2;
                    }
                }
                p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], end, 0);
                len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);

                return len;
        }

        return 0;
    };
    Kinetic.Path.convertEndpointToCenterParameterization = function(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {
        // Derived from: http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
        var psi = psiDeg * (Math.PI / 180.0);
        var xp = Math.cos(psi) * (x1 - x2) / 2.0 + Math.sin(psi) * (y1 - y2) / 2.0;
        var yp = -1 * Math.sin(psi) * (x1 - x2) / 2.0 + Math.cos(psi) * (y1 - y2) / 2.0;

        var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);

        if(lambda > 1) {
            rx *= Math.sqrt(lambda);
            ry *= Math.sqrt(lambda);
        }

        var f = Math.sqrt((((rx * rx) * (ry * ry)) - ((rx * rx) * (yp * yp)) - ((ry * ry) * (xp * xp))) / ((rx * rx) * (yp * yp) + (ry * ry) * (xp * xp)));

        if(fa === fs) {
            f *= -1;
        }
        if(isNaN(f)) {
            f = 0;
        }

        var cxp = f * rx * yp / ry;
        var cyp = f * -ry * xp / rx;

        var cx = (x1 + x2) / 2.0 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
        var cy = (y1 + y2) / 2.0 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;

        var vMag = function(v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        };
        var vRatio = function(u, v) {
            return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
        };
        var vAngle = function(u, v) {
            return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
        };
        var theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);
        var u = [(xp - cxp) / rx, (yp - cyp) / ry];
        var v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
        var dTheta = vAngle(u, v);

        if(vRatio(u, v) <= -1) {
            dTheta = Math.PI;
        }
        if(vRatio(u, v) >= 1) {
            dTheta = 0;
        }
        if(fs === 0 && dTheta > 0) {
            dTheta = dTheta - 2 * Math.PI;
        }
        if(fs === 1 && dTheta < 0) {
            dTheta = dTheta + 2 * Math.PI;
        }
        return [cx, cy, rx, ry, theta, dTheta, psi, fs];
    };
    // add getters setters
    Kinetic.Factory.addGetterSetter(Kinetic.Path, 'data');

    /**
     * set SVG path data string.  This method
     *  also automatically parses the data string
     *  into a data array.  Currently supported SVG data:
     *  M, m, L, l, H, h, V, v, Q, q, T, t, C, c, S, s, A, a, Z, z
     * @name setData
     * @method
     * @memberof Kinetic.Path.prototype
     * @param {String} SVG path command string
     */

    /**
     * get SVG path data string
     * @name getData
     * @method
     * @memberof Kinetic.Path.prototype
     */

    Kinetic.Collection.mapMethods(Kinetic.Path);
})();
;(function() {
    var EMPTY_STRING = '',
        //CALIBRI = 'Calibri',
        NORMAL = 'normal';

    /**
     * Path constructor.
     * @author Jason Follas
     * @constructor
     * @memberof Kinetic
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {String} [config.fontFamily] default is Calibri
     * @param {Number} [config.fontSize] default is 12
     * @param {String} [config.fontStyle] can be normal, bold, or italic.  Default is normal
     * @param {String} [config.fontVariant] can be normal or small-caps.  Default is normal
     * @param {String} config.text
     * @param {String} config.data SVG data string
     * @param {String} [config.fill] fill color
     * @param {Integer} [config.fillRed] set fill red component
     * @param {Integer} [config.fillGreen] set fill green component
     * @param {Integer} [config.fillBlue] set fill blue component
     * @param {Integer} [config.fillAlpha] set fill alpha component
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX]
     * @param {Number} [config.fillPatternOffsetY]
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX]
     * @param {Number} [config.fillRadialGradientEndPointY]
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Integer} [config.strokeRed] set stroke red component
     * @param {Integer} [config.strokeGreen] set stroke green component
     * @param {Integer} [config.strokeBlue] set stroke blue component
     * @param {Integer} [config.strokeAlpha] set stroke alpha component
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Integer} [config.shadowRed] set shadow color red component
     * @param {Integer} [config.shadowGreen] set shadow color green component
     * @param {Integer} [config.shadowBlue] set shadow color blue component
     * @param {Integer} [config.shadowAlpha] set shadow color alpha component
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var textpath = new Kinetic.TextPath({
     *   x: 100,
     *   y: 50,
     *   fill: '#333',
     *   fontSize: '24',
     *   fontFamily: 'Arial',
     *   text: 'All the world\'s a stage, and all the men and women merely players.',
     *   data: 'M10,10 C0,0 10,150 100,100 S300,150 400,50'
     * });
     */
    Kinetic.TextPath = function(config) {
        this.___init(config);
    };

    function _fillFunc(context) {
        context.fillText(this.partialText, 0, 0);
    }
    function _strokeFunc(context) {
        context.strokeText(this.partialText, 0, 0);
    }

    Kinetic.TextPath.prototype = {
        ___init: function(config) {
            var that = this;
            this.dummyCanvas = Kinetic.Util.createCanvasElement();
            this.dataArray = [];

            // call super constructor
            Kinetic.Shape.call(this, config);

            // overrides
            // TODO: shouldn't this be on the prototype?
            this._fillFunc = _fillFunc;
            this._strokeFunc = _strokeFunc;
            this._fillFuncHit = _fillFunc;
            this._strokeFuncHit = _strokeFunc;

            this.className = 'TextPath';

            this.dataArray = Kinetic.Path.parsePathData(this.attrs.data);
            this.on('dataChange.kinetic', function() {
                that.dataArray = Kinetic.Path.parsePathData(this.attrs.data);
            });

            // update text data for certain attr changes
            this.on('textChange.kinetic textStroke.kinetic textStrokeWidth.kinetic', that._setTextData);
            that._setTextData();
            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            context.setAttr('font', this._getContextFont());
            context.setAttr('textBaseline', 'middle');
            context.setAttr('textAlign', 'left');
            context.save();

            var glyphInfo = this.glyphInfo;
            for(var i = 0; i < glyphInfo.length; i++) {
                context.save();

                var p0 = glyphInfo[i].p0;

                context.translate(p0.x, p0.y);
                context.rotate(glyphInfo[i].rotation);
                this.partialText = glyphInfo[i].text;

                context.fillStrokeShape(this);
                context.restore();

                //// To assist with debugging visually, uncomment following
                // context.beginPath();
                // if (i % 2)
                // context.strokeStyle = 'cyan';
                // else
                // context.strokeStyle = 'green';
                // var p1 = glyphInfo[i].p1;
                // context.moveTo(p0.x, p0.y);
                // context.lineTo(p1.x, p1.y);
                // context.stroke();
            }
            context.restore();
        },
        /**
         * get text width in pixels
         * @method
         * @memberof Kinetic.TextPath.prototype
         */
        getTextWidth: function() {
            return this.textWidth;
        },
        /**
         * get text height in pixels
         * @method
         * @memberof Kinetic.TextPath.prototype
         */
        getTextHeight: function() {
            return this.textHeight;
        },
        /**
         * set text
         * @method
         * @memberof Kinetic.TextPath.prototype
         * @param {String} text
         */
        setText: function(text) {
            Kinetic.Text.prototype.setText.call(this, text);
        },
        _getTextSize: function(text) {
            var dummyCanvas = this.dummyCanvas;
            var _context = dummyCanvas.getContext('2d');

            _context.save();

            _context.font = this._getContextFont();
            var metrics = _context.measureText(text);

            _context.restore();

            return {
                width: metrics.width,
                height: parseInt(this.attrs.fontSize, 10)
            };
        },
        _setTextData: function() {

            var that = this;
            var size = this._getTextSize(this.attrs.text);
            this.textWidth = size.width;
            this.textHeight = size.height;

            this.glyphInfo = [];

            var charArr = this.attrs.text.split('');

            var p0, p1, pathCmd;

            var pIndex = -1;
            var currentT = 0;

            var getNextPathSegment = function() {
                currentT = 0;
                var pathData = that.dataArray;

                for(var i = pIndex + 1; i < pathData.length; i++) {
                    if(pathData[i].pathLength > 0) {
                        pIndex = i;

                        return pathData[i];
                    }
                    else if(pathData[i].command == 'M') {
                        p0 = {
                            x: pathData[i].points[0],
                            y: pathData[i].points[1]
                        };
                    }
                }

                return {};
            };
            var findSegmentToFitCharacter = function(c) {

                var glyphWidth = that._getTextSize(c).width;

                var currLen = 0;
                var attempts = 0;

                p1 = undefined;
                while(Math.abs(glyphWidth - currLen) / glyphWidth > 0.01 && attempts < 25) {
                    attempts++;
                    var cumulativePathLength = currLen;
                    while(pathCmd === undefined) {
                        pathCmd = getNextPathSegment();

                        if(pathCmd && cumulativePathLength + pathCmd.pathLength < glyphWidth) {
                            cumulativePathLength += pathCmd.pathLength;
                            pathCmd = undefined;
                        }
                    }

                    if(pathCmd === {} || p0 === undefined) {
                        return undefined;
                    }

                    var needNewSegment = false;

                    switch (pathCmd.command) {
                        case 'L':
                            if(Kinetic.Path.getLineLength(p0.x, p0.y, pathCmd.points[0], pathCmd.points[1]) > glyphWidth) {
                                p1 = Kinetic.Path.getPointOnLine(glyphWidth, p0.x, p0.y, pathCmd.points[0], pathCmd.points[1], p0.x, p0.y);
                            }
                            else {
                                pathCmd = undefined;
                            }
                            break;
                        case 'A':

                            var start = pathCmd.points[4];
                            // 4 = theta
                            var dTheta = pathCmd.points[5];
                            // 5 = dTheta
                            var end = pathCmd.points[4] + dTheta;

                            if(currentT === 0){
                                currentT = start + 0.00000001;
                            }
                            // Just in case start is 0
                            else if(glyphWidth > currLen) {
                                currentT += (Math.PI / 180.0) * dTheta / Math.abs(dTheta);
                            }
                            else {
                                currentT -= Math.PI / 360.0 * dTheta / Math.abs(dTheta);
                            }

                            // Credit for bug fix: @therth https://github.com/ericdrowell/KineticJS/issues/249
                            // Old code failed to render text along arc of this path: "M 50 50 a 150 50 0 0 1 250 50 l 50 0"
                            if(dTheta < 0 && currentT < end || dTheta >= 0 && currentT > end) {
                                currentT = end;
                                needNewSegment = true;
                            }
                            p1 = Kinetic.Path.getPointOnEllipticalArc(pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], currentT, pathCmd.points[6]);
                            break;
                        case 'C':
                            if(currentT === 0) {
                                if(glyphWidth > pathCmd.pathLength) {
                                    currentT = 0.00000001;
                                }
                                else {
                                    currentT = glyphWidth / pathCmd.pathLength;
                                }
                            }
                            else if(glyphWidth > currLen) {
                                currentT += (glyphWidth - currLen) / pathCmd.pathLength;
                            }
                            else {
                                currentT -= (currLen - glyphWidth) / pathCmd.pathLength;
                            }

                            if(currentT > 1.0) {
                                currentT = 1.0;
                                needNewSegment = true;
                            }
                            p1 = Kinetic.Path.getPointOnCubicBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], pathCmd.points[4], pathCmd.points[5]);
                            break;
                        case 'Q':
                            if(currentT === 0) {
                                currentT = glyphWidth / pathCmd.pathLength;
                            }
                            else if(glyphWidth > currLen) {
                                currentT += (glyphWidth - currLen) / pathCmd.pathLength;
                            }
                            else {
                                currentT -= (currLen - glyphWidth) / pathCmd.pathLength;
                            }

                            if(currentT > 1.0) {
                                currentT = 1.0;
                                needNewSegment = true;
                            }
                            p1 = Kinetic.Path.getPointOnQuadraticBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3]);
                            break;

                    }

                    if(p1 !== undefined) {
                        currLen = Kinetic.Path.getLineLength(p0.x, p0.y, p1.x, p1.y);
                    }

                    if(needNewSegment) {
                        needNewSegment = false;
                        pathCmd = undefined;
                    }
                }
            };
            for(var i = 0; i < charArr.length; i++) {

                // Find p1 such that line segment between p0 and p1 is approx. width of glyph
                findSegmentToFitCharacter(charArr[i]);

                if(p0 === undefined || p1 === undefined) {
                    break;
                }

                var width = Kinetic.Path.getLineLength(p0.x, p0.y, p1.x, p1.y);

                // Note: Since glyphs are rendered one at a time, any kerning pair data built into the font will not be used.
                // Can foresee having a rough pair table built in that the developer can override as needed.

                var kern = 0;
                // placeholder for future implementation

                var midpoint = Kinetic.Path.getPointOnLine(kern + width / 2.0, p0.x, p0.y, p1.x, p1.y);

                var rotation = Math.atan2((p1.y - p0.y), (p1.x - p0.x));
                this.glyphInfo.push({
                    transposeX: midpoint.x,
                    transposeY: midpoint.y,
                    text: charArr[i],
                    rotation: rotation,
                    p0: p0,
                    p1: p1
                });
                p0 = p1;
            }
        }
    };

    // map TextPath methods to Text
    Kinetic.TextPath.prototype._getContextFont = Kinetic.Text.prototype._getContextFont;

    Kinetic.Util.extend(Kinetic.TextPath, Kinetic.Shape);

    // add setters and getters
    Kinetic.Factory.addGetterSetter(Kinetic.TextPath, 'fontFamily', 'Arial');

    /**
     * set font family
     * @name setFontFamily
     * @method
     * @memberof Kinetic.TextPath.prototype
     * @param {String} fontFamily
     */

     /**
     * get font family
     * @name getFontFamily
     * @method
     * @memberof Kinetic.TextPath.prototype
     */

    Kinetic.Factory.addGetterSetter(Kinetic.TextPath, 'fontSize', 12);

    /**
     * set font size
     * @name setFontSize
     * @method
     * @memberof Kinetic.TextPath.prototype
     * @param {int} fontSize
     */

     /**
     * get font size
     * @name getFontSize
     * @method
     * @memberof Kinetic.TextPath.prototype
     */

    Kinetic.Factory.addGetterSetter(Kinetic.TextPath, 'fontStyle', NORMAL);

    /**
     * set font style.  Can be 'normal', 'italic', or 'bold'.  'normal' is the default.
     * @name setFontStyle
     * @method
     * @memberof Kinetic.TextPath.prototype
     * @param {String} fontStyle
     */

     /**
     * get font style
     * @name getFontStyle
     * @method
     * @memberof Kinetic.TextPath.prototype
     */

    Kinetic.Factory.addGetterSetter(Kinetic.TextPath, 'fontVariant', NORMAL);

    /**
     * set font variant.  Can be 'normal' or 'small-caps'.  'normal' is the default.
     * @name setFontVariant
     * @method
     * @memberof Kinetic.TextPath.prototype
     * @param {String} fontVariant
     */

    /**
     * @get font variant
     * @name getFontVariant
     * @method
     * @memberof Kinetic.TextPath.prototype
     */

    Kinetic.Factory.addGetter(Kinetic.TextPath, 'text', EMPTY_STRING);

    /**
     * get text
     * @name getText
     * @method
     * @memberof Kinetic.TextPath.prototype
     */

    Kinetic.Collection.mapMethods(Kinetic.TextPath);
})();
;(function() {
    /**
     * RegularPolygon constructor.&nbsp; Examples include triangles, squares, pentagons, hexagons, etc.
     * @constructor
     * @memberof Kinetic
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Number} config.sides
     * @param {Number} config.radius
     * @param {String} [config.fill] fill color
     * @param {Integer} [config.fillRed] set fill red component
     * @param {Integer} [config.fillGreen] set fill green component
     * @param {Integer} [config.fillBlue] set fill blue component
     * @param {Integer} [config.fillAlpha] set fill alpha component
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX]
     * @param {Number} [config.fillPatternOffsetY]
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX]
     * @param {Number} [config.fillRadialGradientEndPointY]
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Integer} [config.strokeRed] set stroke red component
     * @param {Integer} [config.strokeGreen] set stroke green component
     * @param {Integer} [config.strokeBlue] set stroke blue component
     * @param {Integer} [config.strokeAlpha] set stroke alpha component
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Integer} [config.shadowRed] set shadow color red component
     * @param {Integer} [config.shadowGreen] set shadow color green component
     * @param {Integer} [config.shadowBlue] set shadow color blue component
     * @param {Integer} [config.shadowAlpha] set shadow color alpha component
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var hexagon = new Kinetic.RegularPolygon({
     *   x: 100,
     *   y: 200,
     *   sides: 6,
     *   radius: 70,
     *   fill: 'red',
     *   stroke: 'black',
     *   strokeWidth: 4
     * });
     */
    Kinetic.RegularPolygon = function(config) {
        this.___init(config);
    };

    Kinetic.RegularPolygon.prototype = {
        ___init: function(config) {
            // call super constructor
            Kinetic.Shape.call(this, config);
            this.className = 'RegularPolygon';
            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            var sides = this.attrs.sides,
                radius = this.attrs.radius,
                n, x, y;

            context.beginPath();
            context.moveTo(0, 0 - radius);

            for(n = 1; n < sides; n++) {
                x = radius * Math.sin(n * 2 * Math.PI / sides);
                y = -1 * radius * Math.cos(n * 2 * Math.PI / sides);
                context.lineTo(x, y);
            }
            context.closePath();
            context.fillStrokeShape(this);
        }
    };
    Kinetic.Util.extend(Kinetic.RegularPolygon, Kinetic.Shape);

    // add getters setters
    Kinetic.Factory.addGetterSetter(Kinetic.RegularPolygon, 'radius', 0);

    /**
     * set radius
     * @name setRadius
     * @method
     * @memberof Kinetic.RegularPolygon.prototype
     * @param {Number} radius
     */

     /**
     * get radius
     * @name getRadius
     * @method
     * @memberof Kinetic.RegularPolygon.prototype
     */

    Kinetic.Factory.addGetterSetter(Kinetic.RegularPolygon, 'sides', 0);

    /**
     * set number of sides
     * @name setSides
     * @method
     * @memberof Kinetic.RegularPolygon.prototype
     * @param {int} sides
     */

    /**
     * get number of sides
     * @name getSides
     * @method
     * @memberof Kinetic.RegularPolygon.prototype
     */

    Kinetic.Collection.mapMethods(Kinetic.RegularPolygon);
})();
;(function() {
    /**
     * Star constructor
     * @constructor
     * @memberof Kinetic
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Integer} config.numPoints
     * @param {Number} config.innerRadius
     * @param {Number} config.outerRadius
     * @param {String} [config.fill] fill color
     * @param {Integer} [config.fillRed] set fill red component
     * @param {Integer} [config.fillGreen] set fill green component
     * @param {Integer} [config.fillBlue] set fill blue component
     * @param {Integer} [config.fillAlpha] set fill alpha component
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX]
     * @param {Number} [config.fillPatternOffsetY]
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX]
     * @param {Number} [config.fillRadialGradientEndPointY]
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Integer} [config.strokeRed] set stroke red component
     * @param {Integer} [config.strokeGreen] set stroke green component
     * @param {Integer} [config.strokeBlue] set stroke blue component
     * @param {Integer} [config.strokeAlpha] set stroke alpha component
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Integer} [config.shadowRed] set shadow color red component
     * @param {Integer} [config.shadowGreen] set shadow color green component
     * @param {Integer} [config.shadowBlue] set shadow color blue component
     * @param {Integer} [config.shadowAlpha] set shadow color alpha component
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var star = new Kinetic.Star({
     *   x: 100,
     *   y: 200,
     *   numPoints: 5,
     *   innerRadius: 70,
     *   outerRadius: 70,
     *   fill: 'red',
     *   stroke: 'black',
     *   strokeWidth: 4
     * });
     */
    Kinetic.Star = function(config) {
        this.___init(config);
    };

    Kinetic.Star.prototype = {
        ___init: function(config) {
            // call super constructor
            Kinetic.Shape.call(this, config);
            this.className = 'Star';
            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            var innerRadius = this.innerRadius(),
                outerRadius = this.outerRadius(),
                numPoints = this.numPoints();

            context.beginPath();
            context.moveTo(0, 0 - outerRadius);

            for(var n = 1; n < numPoints * 2; n++) {
                var radius = n % 2 === 0 ? outerRadius : innerRadius;
                var x = radius * Math.sin(n * Math.PI / numPoints);
                var y = -1 * radius * Math.cos(n * Math.PI / numPoints);
                context.lineTo(x, y);
            }
            context.closePath();

            context.fillStrokeShape(this);
        }
    };
    Kinetic.Util.extend(Kinetic.Star, Kinetic.Shape);

    // add getters setters
    Kinetic.Factory.addGetterSetter(Kinetic.Star, 'numPoints', 5);

    /**
     * set number of points
     * @name setNumPoints
     * @method
     * @memberof Kinetic.Star.prototype
     * @param {Integer} points
     */

     /**
     * get number of points
     * @name getNumPoints
     * @method
     * @memberof Kinetic.Star.prototype
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Star, 'innerRadius', 0);

    /**
     * set inner radius
     * @name setInnerRadius
     * @method
     * @memberof Kinetic.Star.prototype
     * @param {Number} radius
     */

     /**
     * get inner radius
     * @name getInnerRadius
     * @method
     * @memberof Kinetic.Star.prototype
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Star, 'outerRadius', 0);

    /**
     * set outer radius
     * @name setOuterRadius
     * @method
     * @memberof Kinetic.Star.prototype
     * @param {Number} radius
     */

     /**
     * get outer radius
     * @name getOuterRadius
     * @method
     * @memberof Kinetic.Star.prototype
     */

    Kinetic.Collection.mapMethods(Kinetic.Star);
})();
;(function() {
    // constants
    var ATTR_CHANGE_LIST = ['fontFamily', 'fontSize', 'fontStyle', 'padding', 'lineHeight', 'text'],
        CHANGE_KINETIC = 'Change.kinetic',
        NONE = 'none',
        UP = 'up',
        RIGHT = 'right',
        DOWN = 'down',
        LEFT = 'left',
        LABEL = 'Label',

     // cached variables
     attrChangeListLen = ATTR_CHANGE_LIST.length;

    /**
     * Label constructor.&nbsp; Labels are groups that contain a Text and Tag shape
     * @constructor
     * @memberof Kinetic
     * @param {Object} config
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * // create label
     * var label = new Kinetic.Label({
     *   x: 100,
     *   y: 100,
     *   draggable: true
     * });
     *
     * // add a tag to the label
     * label.add(new Kinetic.Tag({
     *   fill: '#bbb',
     *   stroke: '#333',
     *   shadowColor: 'black',
     *   shadowBlur: 10,
     *   shadowOffset: [10, 10],
     *   shadowOpacity: 0.2,
     *   lineJoin: 'round',
     *   pointerDirection: 'up',
     *   pointerWidth: 20,
     *   pointerHeight: 20,
     *   cornerRadius: 5
     * }));
     *
     * // add text to the label
     * label.add(new Kinetic.Text({
     *   text: 'Hello World!',
     *   fontSize: 50,
     *   lineHeight: 1.2,
     *   padding: 10,
     *   fill: 'green'
     *  }));
     */
    Kinetic.Label = function(config) {
        this.____init(config);
    };

    Kinetic.Label.prototype = {
        ____init: function(config) {
            var that = this;

            Kinetic.Group.call(this, config);
            this.className = LABEL;

            this.on('add.kinetic', function(evt) {
                that._addListeners(evt.child);
                that._sync();
            });
        },
        /**
         * get Text shape for the label.  You need to access the Text shape in order to update
         * the text properties
         * @name getText
         * @method
         * @memberof Kinetic.Label.prototype
         */
        getText: function() {
            return this.find('Text')[0];
        },
        /**
         * get Tag shape for the label.  You need to access the Tag shape in order to update
         * the pointer properties and the corner radius
         * @name getTag
         * @method
         * @memberof Kinetic.Label.prototype
         */
        getTag: function() {
            return this.find('Tag')[0];
        },
        _addListeners: function(text) {
            var that = this,
                n;
            var func = function(){
                    that._sync();
                };

            // update text data for certain attr changes
            for(n = 0; n < attrChangeListLen; n++) {
                text.on(ATTR_CHANGE_LIST[n] + CHANGE_KINETIC, func);
            }
        },
        getWidth: function() {
            return this.getText().getWidth();
        },
        getHeight: function() {
            return this.getText().getHeight();
        },
        _sync: function() {
            var text = this.getText(),
                tag = this.getTag(),
                width, height, pointerDirection, pointerWidth, x, y, pointerHeight;

            if (text && tag) {
                width = text.getWidth();
                height = text.getHeight();
                pointerDirection = tag.getPointerDirection();
                pointerWidth = tag.getPointerWidth();
                pointerHeight = tag.getPointerHeight();
                x = 0;
                y = 0;

                switch(pointerDirection) {
                    case UP:
                        x = width / 2;
                        y = -1 * pointerHeight;
                        break;
                    case RIGHT:
                        x = width + pointerWidth;
                        y = height / 2;
                        break;
                    case DOWN:
                        x = width / 2;
                        y = height + pointerHeight;
                        break;
                    case LEFT:
                        x = -1 * pointerWidth;
                        y = height / 2;
                        break;
                }

                tag.setAttrs({
                    x: -1 * x,
                    y: -1 * y,
                    width: width,
                    height: height
                });

                text.setAttrs({
                    x: -1 * x,
                    y: -1 * y
                });
            }
        }
    };

    Kinetic.Util.extend(Kinetic.Label, Kinetic.Group);

    Kinetic.Collection.mapMethods(Kinetic.Label);

    /**
     * Tag constructor.&nbsp; A Tag can be configured
     *  to have a pointer element that points up, right, down, or left
     * @constructor
     * @memberof Kinetic
     * @param {Object} config
     * @param {String} [config.pointerDirection] can be up, right, down, left, or none; the default
     *  is none.  When a pointer is present, the positioning of the label is relative to the tip of the pointer.
     * @param {Number} [config.pointerWidth]
     * @param {Number} [config.pointerHeight]
     * @param {Number} [config.cornerRadius]
     */
    Kinetic.Tag = function(config) {
        this.___init(config);
    };

    Kinetic.Tag.prototype = {
        ___init: function(config) {
            Kinetic.Shape.call(this, config);
            this.className = 'Tag';
            this.sceneFunc(this._sceneFunc);
        },
        _sceneFunc: function(context) {
            var width = this.getWidth(),
                height = this.getHeight(),
                pointerDirection = this.getPointerDirection(),
                pointerWidth = this.getPointerWidth(),
                pointerHeight = this.getPointerHeight(),
                cornerRadius = this.getCornerRadius();

            context.beginPath();
            context.moveTo(0,0);

            if (pointerDirection === UP) {
                context.lineTo((width - pointerWidth)/2, 0);
                context.lineTo(width/2, -1 * pointerHeight);
                context.lineTo((width + pointerWidth)/2, 0);
            }

            if(!cornerRadius) {
                context.lineTo(width, 0);
            } else {
                context.lineTo(width - cornerRadius, 0);
                context.arc(width - cornerRadius, cornerRadius, cornerRadius, Math.PI * 3 / 2, 0, false);
            }

            if (pointerDirection === RIGHT) {
                context.lineTo(width, (height - pointerHeight)/2);
                context.lineTo(width + pointerWidth, height/2);
                context.lineTo(width, (height + pointerHeight)/2);
            }

            if(!cornerRadius) {
                context.lineTo(width, height);
            } else {
                context.lineTo(width, height - cornerRadius);
                context.arc(width - cornerRadius, height - cornerRadius, cornerRadius, 0, Math.PI / 2, false);
            }

            if (pointerDirection === DOWN) {
                context.lineTo((width + pointerWidth)/2, height);
                context.lineTo(width/2, height + pointerHeight);
                context.lineTo((width - pointerWidth)/2, height);
            }

            if(!cornerRadius) {
                context.lineTo(0, height);
            } else {
                context.lineTo(cornerRadius, height);
                context.arc(cornerRadius, height - cornerRadius, cornerRadius, Math.PI / 2, Math.PI, false);
            }

            if (pointerDirection === LEFT) {
                context.lineTo(0, (height + pointerHeight)/2);
                context.lineTo(-1 * pointerWidth, height/2);
                context.lineTo(0, (height - pointerHeight)/2);
            }

            if(cornerRadius) {
                context.lineTo(0, cornerRadius);
                context.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, Math.PI * 3 / 2, false);
            }

            context.closePath();
            context.fillStrokeShape(this);
        }
    };

    Kinetic.Util.extend(Kinetic.Tag, Kinetic.Shape);
    Kinetic.Factory.addGetterSetter(Kinetic.Tag, 'pointerDirection', NONE);

    /**
     * set pointer Direction
     * @name setPointerDirection
     * @method
     * @memberof Kinetic.Tag.prototype
     * @param {String} pointerDirection can be up, right, down, left, or none.  The
     *  default is none
     */

     /**
     * get pointer Direction
     * @name getPointerDirection
     * @method
     * @memberof Kinetic.Tag.prototype
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Tag, 'pointerWidth', 0);

    /**
     * set pointer width
     * @name setPointerWidth
     * @method
     * @memberof Kinetic.Tag.prototype
     * @param {Number} pointerWidth
     */

     /**
     * get pointer width
     * @name getPointerWidth
     * @method
     * @memberof Kinetic.Tag.prototype
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Tag, 'pointerHeight', 0);

    /**
     * set pointer height
     * @name setPointerHeight
     * @method
     * @memberof Kinetic.Tag.prototype
     * @param {Number} pointerHeight
     */

     /**
     * get pointer height
     * @name getPointerHeight
     * @method
     * @memberof Kinetic.Tag.prototype
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Tag, 'cornerRadius', 0);

    /**
     * set corner radius
     * @name setCornerRadius
     * @method
     * @memberof Kinetic.Tag.prototype
     * @param {Number} corner radius
     */

    /**
     * get corner radius
     * @name getCornerRadius
     * @method
     * @memberof Kinetic.Tag.prototype
     */

    Kinetic.Collection.mapMethods(Kinetic.Tag);
})();
;(function() {
    /**
     * Arrow constructor
     * @constructor
     * @memberof Kinetic
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Array} config.points
     * @param {Number} [config.tension] Higher values will result in a more curvy line.  A value of 0 will result in no interpolation.
     *   The default is 0
     * @param {Number} config.pointerLength
     * @param {Number} config.pointerWidth
     * @param {String} [config.fill] fill color
     * @param {Integer} [config.fillRed] set fill red component
     * @param {Integer} [config.fillGreen] set fill green component
     * @param {Integer} [config.fillBlue] set fill blue component
     * @param {Integer} [config.fillAlpha] set fill alpha component
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Object} [config.fillPatternOffset] object with x and y component
     * @param {Number} [config.fillPatternOffsetX]
     * @param {Number} [config.fillPatternOffsetY]
     * @param {Object} [config.fillPatternScale] object with x and y component
     * @param {Number} [config.fillPatternScaleX]
     * @param {Number} [config.fillPatternScaleY]
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be "repeat", "repeat-x", "repeat-y", or "no-repeat".  The default is "no-repeat"
     * @param {Object} [config.fillLinearGradientStartPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientStartPointX]
     * @param {Number} [config.fillLinearGradientStartPointY]
     * @param {Object} [config.fillLinearGradientEndPoint] object with x and y component
     * @param {Number} [config.fillLinearGradientEndPointX]
     * @param {Number} [config.fillLinearGradientEndPointY]
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Object} [config.fillRadialGradientStartPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientStartPointX]
     * @param {Number} [config.fillRadialGradientStartPointY]
     * @param {Object} [config.fillRadialGradientEndPoint] object with x and y component
     * @param {Number} [config.fillRadialGradientEndPointX]
     * @param {Number} [config.fillRadialGradientEndPointY]
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Integer} [config.strokeRed] set stroke red component
     * @param {Integer} [config.strokeGreen] set stroke green component
     * @param {Integer} [config.strokeBlue] set stroke blue component
     * @param {Integer} [config.strokeAlpha] set stroke alpha component
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeScaleEnabled] flag which enables or disables stroke scale.  The default is true
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Integer} [config.shadowRed] set shadow color red component
     * @param {Integer} [config.shadowGreen] set shadow color green component
     * @param {Integer} [config.shadowBlue] set shadow color blue component
     * @param {Integer} [config.shadowAlpha] set shadow color alpha component
     * @param {Number} [config.shadowBlur]
     * @param {Object} [config.shadowOffset] object with x and y component
     * @param {Number} [config.shadowOffsetX]
     * @param {Number} [config.shadowOffsetY]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dash]
     * @param {Boolean} [config.dashEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale] set scale
     * @param {Number} [config.scaleX] set scale x
     * @param {Number} [config.scaleY] set scale y
     * @param {Number} [config.rotation] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offsetX] set offset x
     * @param {Number} [config.offsetY] set offset y
     * @param {Boolean} [config.draggable] makes the node draggable.  When stages are draggable, you can drag and drop
     *  the entire stage by dragging any portion of the stage
     * @param {Number} [config.dragDistance]
     * @param {Function} [config.dragBoundFunc]
     * @example
     * var line = new Kinetic.Line({
     *   points: [73, 70, 340, 23, 450, 60, 500, 20],
     *   stroke: 'red',
     *   tension: 1,
     *   pointerLength : 10,
     *   pointerWidth : 12
     * });
     */
    Kinetic.Arrow = function(config) {
        this.____init(config);
    };

    Kinetic.Arrow.prototype = {
        ____init : function(config) {
            // call super constructor
            Kinetic.Line.call(this, config);
            this.className = 'Arrow';
        },
        _sceneFunc : function(ctx) {
            var PI2 = Math.PI * 2;
            var points = this.points();
            var n = points.length;
            var dx = points[n-2] - points[n-4];
            var dy = points[n-1] - points[n-3];
            var radians = (Math.atan2(dy, dx) + PI2) % PI2;
            var length = this.pointerLength();
            var width = this.pointerWidth();

            ctx.save();
            ctx.beginPath();
            ctx.translate(points[n-2], points[n-1]);
            ctx.rotate(radians);
            ctx.moveTo(0, 0);
            ctx.lineTo(-length, width / 2);
            ctx.lineTo(-length, -width / 2);
            ctx.closePath();
            ctx.restore();

            if (this.pointerAtBeginning()) {
                ctx.save();
                ctx.translate(points[0], points[1]);
                dx = points[2] - points[0];
                dy = points[3] - points[1];
                ctx.rotate((Math.atan2(-dy, -dx) + PI2) % PI2);
                ctx.moveTo(0, 0);
                ctx.lineTo(-10, 6);
                ctx.lineTo(-10, -6);
                ctx.closePath();
                ctx.restore();
            }

            ctx.fillStrokeShape(this);
            Kinetic.Line.prototype._sceneFunc.apply(this, arguments);
        }
    };

    Kinetic.Util.extend(Kinetic.Arrow, Kinetic.Line);
    /**
     * get/set pointerLength
     * @name pointerLength
     * @method
     * @memberof Kinetic.Arrow.prototype
     * @param {Number} Length of pointer of arrow.
     *   The default is 10.
     * @returns {Number}
     * @example
     * // get tension
     * var pointerLength = line.pointerLength();
     *
     * // set tension
     * line.pointerLength(15);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Arrow, 'pointerLength', 10);
    /**
     * get/set pointerWidth
     * @name pointerWidth
     * @method
     * @memberof Kinetic.Arrow.prototype
     * @param {Number} Width of pointer of arrow.
     *   The default is 10.
     * @returns {Number}
     * @example
     * // get tension
     * var pointerWidth = line.pointerWidth();
     *
     * // set tension
     * line.pointerWidth(15);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Arrow, 'pointerWidth', 10);
    /**
     * get/set pointerAtBeginning
     * @name pointerAtBeginning
     * @method
     * @memberof Kinetic.Arrow.prototype
     * @param {Number} Should pointer displayed at beginning of arrow.
     *   The default is false.
     * @returns {Boolean}
     * @example
     * // get tension
     * var pointerAtBeginning = line.pointerAtBeginning();
     *
     * // set tension
     * line.pointerAtBeginning(true);
     */

    Kinetic.Factory.addGetterSetter(Kinetic.Arrow, 'pointerAtBeginning', false);
    Kinetic.Collection.mapMethods(Kinetic.Arrow);

})();

///////////////////

/*! KineticJS v5.2.0 2015-01-22 http://lavrton.github.io/KineticJS/ by Eric Rowell @ericdrowell, Anton Lavrenov @lavrton - MIT License https://github.com/lavrton/KineticJS/wiki/License*/
var Kinetic={};!function(a){var b=Math.PI/180;Kinetic={version:"5.2.0",stages:[],idCounter:0,ids:{},names:{},shapes:{},listenClickTap:!1,inDblClickWindow:!1,enableTrace:!1,traceArrMax:100,dblClickWindow:400,pixelRatio:void 0,dragDistance:0,angleDeg:!0,showWarnings:!0,Filters:{},Node:function(a){this._init(a)},Shape:function(a){this.__init(a)},Container:function(a){this.__init(a)},Stage:function(a){this.___init(a)},BaseLayer:function(a){this.___init(a)},Layer:function(a){this.____init(a)},FastLayer:function(a){this.____init(a)},Group:function(a){this.___init(a)},isDragging:function(){var a=Kinetic.DD;return a?a.isDragging:!1},isDragReady:function(){var a=Kinetic.DD;return a?!!a.node:!1},_addId:function(a,b){void 0!==b&&(this.ids[b]=a)},_removeId:function(a){void 0!==a&&delete this.ids[a]},_addName:function(a,b){if(void 0!==b)for(var c=b.split(/\s/g),d=0;d<c.length;d++){var e=c[d];e&&(void 0===this.names[e]&&(this.names[e]=[]),this.names[e].push(a))}},_removeName:function(a,b){if(void 0!==a){var c=this.names[a];if(void 0!==c){for(var d=0;d<c.length;d++){var e=c[d];e._id===b&&c.splice(d,1)}0===c.length&&delete this.names[a]}}},getAngle:function(a){return this.angleDeg?a*b:a},_parseUA:function(a){var b=a.toLowerCase(),c=/(chrome)[ \/]([\w.]+)/.exec(b)||/(webkit)[ \/]([\w.]+)/.exec(b)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(b)||/(msie) ([\w.]+)/.exec(b)||b.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(b)||[],d=!!a.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i),e=!!a.match(/IEMobile/i);return{browser:c[1]||"",version:c[2]||"0",mobile:d,ieMobile:e}},UA:void 0},Kinetic.UA=Kinetic._parseUA(a.navigator&&a.navigator.userAgent||"")}(this),function(a,b){if("object"==typeof exports){var c=b();if(global.window===global)Kinetic.document=global.document,Kinetic.window=global;else{var d=require("canvas"),e=require("jsdom").jsdom;Kinetic.document=e("<!DOCTYPE html><html><head></head><body></body></html>"),Kinetic.window=Kinetic.document.createWindow(),Kinetic.window.Image=d.Image,Kinetic._nodeCanvas=d}return Kinetic.root=a,void(module.exports=c)}"function"==typeof define&&define.amd&&define(b),Kinetic.document=document,Kinetic.window=window,Kinetic.root=a}(this,function(){return Kinetic}),function(){Kinetic.Collection=function(){var a=[].slice.call(arguments),b=a.length,c=0;for(this.length=b;b>c;c++)this[c]=a[c];return this},Kinetic.Collection.prototype=[],Kinetic.Collection.prototype.each=function(a){for(var b=0;b<this.length;b++)a(this[b],b)},Kinetic.Collection.prototype.toArray=function(){var a,b=[],c=this.length;for(a=0;c>a;a++)b.push(this[a]);return b},Kinetic.Collection.toCollection=function(a){var b,c=new Kinetic.Collection,d=a.length;for(b=0;d>b;b++)c.push(a[b]);return c},Kinetic.Collection._mapMethod=function(a){Kinetic.Collection.prototype[a]=function(){var b,c=this.length,d=[].slice.call(arguments);for(b=0;c>b;b++)this[b][a].apply(this[b],d);return this}},Kinetic.Collection.mapMethods=function(a){var b=a.prototype;for(var c in b)Kinetic.Collection._mapMethod(c)},Kinetic.Transform=function(a){this.m=a&&a.slice()||[1,0,0,1,0,0]},Kinetic.Transform.prototype={copy:function(){return new Kinetic.Transform(this.m)},point:function(a){var b=this.m;return{x:b[0]*a.x+b[2]*a.y+b[4],y:b[1]*a.x+b[3]*a.y+b[5]}},translate:function(a,b){return this.m[4]+=this.m[0]*a+this.m[2]*b,this.m[5]+=this.m[1]*a+this.m[3]*b,this},scale:function(a,b){return this.m[0]*=a,this.m[1]*=a,this.m[2]*=b,this.m[3]*=b,this},rotate:function(a){var b=Math.cos(a),c=Math.sin(a),d=this.m[0]*b+this.m[2]*c,e=this.m[1]*b+this.m[3]*c,f=this.m[0]*-c+this.m[2]*b,g=this.m[1]*-c+this.m[3]*b;return this.m[0]=d,this.m[1]=e,this.m[2]=f,this.m[3]=g,this},getTranslation:function(){return{x:this.m[4],y:this.m[5]}},skew:function(a,b){var c=this.m[0]+this.m[2]*b,d=this.m[1]+this.m[3]*b,e=this.m[2]+this.m[0]*a,f=this.m[3]+this.m[1]*a;return this.m[0]=c,this.m[1]=d,this.m[2]=e,this.m[3]=f,this},multiply:function(a){var b=this.m[0]*a.m[0]+this.m[2]*a.m[1],c=this.m[1]*a.m[0]+this.m[3]*a.m[1],d=this.m[0]*a.m[2]+this.m[2]*a.m[3],e=this.m[1]*a.m[2]+this.m[3]*a.m[3],f=this.m[0]*a.m[4]+this.m[2]*a.m[5]+this.m[4],g=this.m[1]*a.m[4]+this.m[3]*a.m[5]+this.m[5];return this.m[0]=b,this.m[1]=c,this.m[2]=d,this.m[3]=e,this.m[4]=f,this.m[5]=g,this},invert:function(){var a=1/(this.m[0]*this.m[3]-this.m[1]*this.m[2]),b=this.m[3]*a,c=-this.m[1]*a,d=-this.m[2]*a,e=this.m[0]*a,f=a*(this.m[2]*this.m[5]-this.m[3]*this.m[4]),g=a*(this.m[1]*this.m[4]-this.m[0]*this.m[5]);return this.m[0]=b,this.m[1]=c,this.m[2]=d,this.m[3]=e,this.m[4]=f,this.m[5]=g,this},getMatrix:function(){return this.m},setAbsolutePosition:function(a,b){var c=this.m[0],d=this.m[1],e=this.m[2],f=this.m[3],g=this.m[4],h=this.m[5],i=(c*(b-h)-d*(a-g))/(c*f-d*e),j=(a-g-e*i)/c;return this.translate(j,i)}};var a="2d",b="[object Array]",c="[object Number]",d="[object String]",e=Math.PI/180,f=180/Math.PI,g="#",h="",i="0",j="Kinetic warning: ",k="Kinetic error: ",l="rgb(",m={aqua:[0,255,255],lime:[0,255,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,255],navy:[0,0,128],white:[255,255,255],fuchsia:[255,0,255],olive:[128,128,0],yellow:[255,255,0],orange:[255,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[255,0,0],pink:[255,192,203],cyan:[0,255,255],transparent:[255,255,255,0]},n=/rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;Kinetic.Util={_isElement:function(a){return!(!a||1!=a.nodeType)},_isFunction:function(a){return!!(a&&a.constructor&&a.call&&a.apply)},_isObject:function(a){return!!a&&a.constructor==Object},_isArray:function(a){return Object.prototype.toString.call(a)==b},_isNumber:function(a){return Object.prototype.toString.call(a)==c},_isString:function(a){return Object.prototype.toString.call(a)==d},_throttle:function(a,b,c){var d,e,f,g=null,h=0,i=c||{},j=function(){h=i.leading===!1?0:(new Date).getTime(),g=null,f=a.apply(d,e),d=e=null};return function(){var c=(new Date).getTime();h||i.leading!==!1||(h=c);var k=b-(c-h);return d=this,e=arguments,0>=k?(clearTimeout(g),g=null,h=c,f=a.apply(d,e),d=e=null):g||i.trailing===!1||(g=setTimeout(j,k)),f}},_hasMethods:function(a){var b,c=[];for(b in a)this._isFunction(a[b])&&c.push(b);return c.length>0},createCanvasElement:function(){var a=Kinetic.document.createElement("canvas");try{a.style=a.style||{}}catch(b){}return a},isBrowser:function(){return"object"!=typeof exports},_isInDocument:function(a){for(;a=a.parentNode;)if(a==Kinetic.document)return!0;return!1},_simplifyArray:function(a){var b,c,d=[],e=a.length,f=Kinetic.Util;for(b=0;e>b;b++)c=a[b],f._isNumber(c)?c=Math.round(1e3*c)/1e3:f._isString(c)||(c=c.toString()),d.push(c);return d},_getImage:function(b,c){var d,e;if(b)if(this._isElement(b))c(b);else if(this._isString(b))d=new Kinetic.window.Image,d.onload=function(){c(d)},d.src=b;else if(b.data){e=Kinetic.Util.createCanvasElement(),e.width=b.width,e.height=b.height;var f=e.getContext(a);f.putImageData(b,0,0),this._getImage(e.toDataURL(),c)}else c(null);else c(null)},_getRGBAString:function(a){var b=a.red||0,c=a.green||0,d=a.blue||0,e=a.alpha||1;return["rgba(",b,",",c,",",d,",",e,")"].join(h)},_rgbToHex:function(a,b,c){return((1<<24)+(a<<16)+(b<<8)+c).toString(16).slice(1)},_hexToRgb:function(a){a=a.replace(g,h);var b=parseInt(a,16);return{r:b>>16&255,g:b>>8&255,b:255&b}},getRandomColor:function(){for(var a=(16777215*Math.random()<<0).toString(16);a.length<6;)a=i+a;return g+a},get:function(a,b){return void 0===a?b:a},getRGB:function(a){var b;return a in m?(b=m[a],{r:b[0],g:b[1],b:b[2]}):a[0]===g?this._hexToRgb(a.substring(1)):a.substr(0,4)===l?(b=n.exec(a.replace(/ /g,"")),{r:parseInt(b[1],10),g:parseInt(b[2],10),b:parseInt(b[3],10)}):{r:0,g:0,b:0}},_merge:function(a,b){var c=this._clone(b);for(var d in a)c[d]=this._isObject(a[d])?this._merge(a[d],c[d]):a[d];return c},cloneObject:function(a){var b={};for(var c in a)b[c]=this._isObject(a[c])?this.cloneObject(a[c]):this._isArray(a[c])?this.cloneArray(a[c]):a[c];return b},cloneArray:function(a){return a.slice(0)},_degToRad:function(a){return a*e},_radToDeg:function(a){return a*f},_capitalize:function(a){return a.charAt(0).toUpperCase()+a.slice(1)},error:function(a){throw new Error(k+a)},warn:function(a){Kinetic.root.console&&console.warn&&Kinetic.showWarnings&&console.warn(j+a)},extend:function(a,b){function c(){this.constructor=a}c.prototype=b.prototype;var d=a.prototype;a.prototype=new c;for(var e in d)d.hasOwnProperty(e)&&(a.prototype[e]=d[e]);a.__super__=b.prototype},addMethods:function(a,b){var c;for(c in b)a.prototype[c]=b[c]},_getControlPoints:function(a,b,c,d,e,f,g){var h=Math.sqrt(Math.pow(c-a,2)+Math.pow(d-b,2)),i=Math.sqrt(Math.pow(e-c,2)+Math.pow(f-d,2)),j=g*h/(h+i),k=g*i/(h+i),l=c-j*(e-a),m=d-j*(f-b),n=c+k*(e-a),o=d+k*(f-b);return[l,m,n,o]},_expandPoints:function(a,b){var c,d,e=a.length,f=[];for(c=2;e-2>c;c+=2)d=Kinetic.Util._getControlPoints(a[c-2],a[c-1],a[c],a[c+1],a[c+2],a[c+3],b),f.push(d[0]),f.push(d[1]),f.push(a[c]),f.push(a[c+1]),f.push(d[2]),f.push(d[3]);return f},_removeLastLetter:function(a){return a.substring(0,a.length-1)}}}(),function(){var a=Kinetic.Util.createCanvasElement(),b=a.getContext("2d"),c=Kinetic.UA.mobile?function(){var a=window.devicePixelRatio||1,c=b.webkitBackingStorePixelRatio||b.mozBackingStorePixelRatio||b.msBackingStorePixelRatio||b.oBackingStorePixelRatio||b.backingStorePixelRatio||1;return a/c}():1;Kinetic.Canvas=function(a){this.init(a)},Kinetic.Canvas.prototype={init:function(a){var b=a||{},d=b.pixelRatio||Kinetic.pixelRatio||c;this.pixelRatio=d,this._canvas=Kinetic.Util.createCanvasElement(),this._canvas.style.padding=0,this._canvas.style.margin=0,this._canvas.style.border=0,this._canvas.style.background="transparent",this._canvas.style.position="absolute",this._canvas.style.top=0,this._canvas.style.left=0},getContext:function(){return this.context},getPixelRatio:function(){return this.pixelRatio},setPixelRatio:function(a){this.pixelRatio=a,this.setSize(this.getWidth(),this.getHeight())},setWidth:function(a){this.width=this._canvas.width=a*this.pixelRatio,this._canvas.style.width=a+"px"},setHeight:function(a){this.height=this._canvas.height=a*this.pixelRatio,this._canvas.style.height=a+"px"},getWidth:function(){return this.width},getHeight:function(){return this.height},setSize:function(a,b){this.setWidth(a),this.setHeight(b)},toDataURL:function(a,b){try{return this._canvas.toDataURL(a,b)}catch(c){try{return this._canvas.toDataURL()}catch(d){return Kinetic.Util.warn("Unable to get data URL. "+d.message),""}}}},Kinetic.SceneCanvas=function(a){var b=a||{},c=b.width||0,d=b.height||0;Kinetic.Canvas.call(this,b),this.context=new Kinetic.SceneContext(this),this.setSize(c,d)},Kinetic.SceneCanvas.prototype={setWidth:function(a){var b=this.pixelRatio,c=this.getContext()._context;Kinetic.Canvas.prototype.setWidth.call(this,a),c.scale(b,b)},setHeight:function(a){var b=this.pixelRatio,c=this.getContext()._context;Kinetic.Canvas.prototype.setHeight.call(this,a),c.scale(b,b)}},Kinetic.Util.extend(Kinetic.SceneCanvas,Kinetic.Canvas),Kinetic.HitCanvas=function(a){var b=a||{},c=b.width||0,d=b.height||0;Kinetic.Canvas.call(this,b),this.context=new Kinetic.HitContext(this),this.setSize(c,d),this.hitCanvas=!0},Kinetic.Util.extend(Kinetic.HitCanvas,Kinetic.Canvas)}(),function(){var a=",",b="(",c=")",d="([",e="])",f=";",g="()",h="=",i=["arc","arcTo","beginPath","bezierCurveTo","clearRect","clip","closePath","createLinearGradient","createPattern","createRadialGradient","drawImage","fill","fillText","getImageData","createImageData","lineTo","moveTo","putImageData","quadraticCurveTo","rect","restore","rotate","save","scale","setLineDash","setTransform","stroke","strokeText","transform","translate"];Kinetic.Context=function(a){this.init(a)},Kinetic.Context.prototype={init:function(a){this.canvas=a,this._context=a._canvas.getContext("2d"),Kinetic.enableTrace&&(this.traceArr=[],this._enableTrace())},fillShape:function(a){a.getFillEnabled()&&this._fill(a)},strokeShape:function(a){a.getStrokeEnabled()&&this._stroke(a)},fillStrokeShape:function(a){var b=a.getFillEnabled();b&&this._fill(a),a.getStrokeEnabled()&&this._stroke(a)},getTrace:function(i){var j,k,l,m,n=this.traceArr,o=n.length,p="";for(j=0;o>j;j++)k=n[j],l=k.method,l?(m=k.args,p+=l,p+=i?g:Kinetic.Util._isArray(m[0])?d+m.join(a)+e:b+m.join(a)+c):(p+=k.property,i||(p+=h+k.val)),p+=f;return p},clearTrace:function(){this.traceArr=[]},_trace:function(a){var b,c=this.traceArr;c.push(a),b=c.length,b>=Kinetic.traceArrMax&&c.shift()},reset:function(){var a=this.getCanvas().getPixelRatio();this.setTransform(1*a,0,0,1*a,0,0)},getCanvas:function(){return this.canvas},clear:function(a){var b=this.getCanvas();a?this.clearRect(a.x||0,a.y||0,a.width||0,a.height||0):this.clearRect(0,0,b.getWidth(),b.getHeight())},_applyLineCap:function(a){var b=a.getLineCap();b&&this.setAttr("lineCap",b)},_applyOpacity:function(a){var b=a.getAbsoluteOpacity();1!==b&&this.setAttr("globalAlpha",b)},_applyLineJoin:function(a){var b=a.getLineJoin();b&&this.setAttr("lineJoin",b)},setAttr:function(a,b){this._context[a]=b},arc:function(){var a=arguments;this._context.arc(a[0],a[1],a[2],a[3],a[4],a[5])},beginPath:function(){this._context.beginPath()},bezierCurveTo:function(){var a=arguments;this._context.bezierCurveTo(a[0],a[1],a[2],a[3],a[4],a[5])},clearRect:function(){var a=arguments;this._context.clearRect(a[0],a[1],a[2],a[3])},clip:function(){this._context.clip()},closePath:function(){this._context.closePath()},createImageData:function(){var a=arguments;return 2===a.length?this._context.createImageData(a[0],a[1]):1===a.length?this._context.createImageData(a[0]):void 0},createLinearGradient:function(){var a=arguments;return this._context.createLinearGradient(a[0],a[1],a[2],a[3])},createPattern:function(){var a=arguments;return this._context.createPattern(a[0],a[1])},createRadialGradient:function(){var a=arguments;return this._context.createRadialGradient(a[0],a[1],a[2],a[3],a[4],a[5])},drawImage:function(){var a=arguments,b=this._context;3===a.length?b.drawImage(a[0],a[1],a[2]):5===a.length?b.drawImage(a[0],a[1],a[2],a[3],a[4]):9===a.length&&b.drawImage(a[0],a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8])},fill:function(){this._context.fill()},fillText:function(){var a=arguments;this._context.fillText(a[0],a[1],a[2])},getImageData:function(){var a=arguments;return this._context.getImageData(a[0],a[1],a[2],a[3])},lineTo:function(){var a=arguments;this._context.lineTo(a[0],a[1])},moveTo:function(){var a=arguments;this._context.moveTo(a[0],a[1])},rect:function(){var a=arguments;this._context.rect(a[0],a[1],a[2],a[3])},putImageData:function(){var a=arguments;this._context.putImageData(a[0],a[1],a[2])},quadraticCurveTo:function(){var a=arguments;this._context.quadraticCurveTo(a[0],a[1],a[2],a[3])},restore:function(){this._context.restore()},rotate:function(){var a=arguments;this._context.rotate(a[0])},save:function(){this._context.save()},scale:function(){var a=arguments;this._context.scale(a[0],a[1])},setLineDash:function(){var a=arguments,b=this._context;this._context.setLineDash?b.setLineDash(a[0]):"mozDash"in b?b.mozDash=a[0]:"webkitLineDash"in b&&(b.webkitLineDash=a[0])},setTransform:function(){var a=arguments;this._context.setTransform(a[0],a[1],a[2],a[3],a[4],a[5])},stroke:function(){this._context.stroke()},strokeText:function(){var a=arguments;this._context.strokeText(a[0],a[1],a[2])},transform:function(){var a=arguments;this._context.transform(a[0],a[1],a[2],a[3],a[4],a[5])},translate:function(){var a=arguments;this._context.translate(a[0],a[1])},_enableTrace:function(){var a,b,c=this,d=i.length,e=Kinetic.Util._simplifyArray,f=this.setAttr,g=function(a){var d,f=c[a];c[a]=function(){return b=e(Array.prototype.slice.call(arguments,0)),d=f.apply(c,arguments),c._trace({method:a,args:b}),d}};for(a=0;d>a;a++)g(i[a]);c.setAttr=function(){f.apply(c,arguments),c._trace({property:arguments[0],val:arguments[1]})}}},Kinetic.SceneContext=function(a){Kinetic.Context.call(this,a)},Kinetic.SceneContext.prototype={_fillColor:function(a){var b=a.fill()||Kinetic.Util._getRGBAString({red:a.fillRed(),green:a.fillGreen(),blue:a.fillBlue(),alpha:a.fillAlpha()});this.setAttr("fillStyle",b),a._fillFunc(this)},_fillPattern:function(a){var b=a.getFillPatternImage(),c=a.getFillPatternX(),d=a.getFillPatternY(),e=a.getFillPatternScale(),f=Kinetic.getAngle(a.getFillPatternRotation()),g=a.getFillPatternOffset(),h=a.getFillPatternRepeat();(c||d)&&this.translate(c||0,d||0),f&&this.rotate(f),e&&this.scale(e.x,e.y),g&&this.translate(-1*g.x,-1*g.y),this.setAttr("fillStyle",this.createPattern(b,h||"repeat")),this.fill()},_fillLinearGradient:function(a){var b=a.getFillLinearGradientStartPoint(),c=a.getFillLinearGradientEndPoint(),d=a.getFillLinearGradientColorStops(),e=this.createLinearGradient(b.x,b.y,c.x,c.y);if(d){for(var f=0;f<d.length;f+=2)e.addColorStop(d[f],d[f+1]);this.setAttr("fillStyle",e),this.fill()}},_fillRadialGradient:function(a){for(var b=a.getFillRadialGradientStartPoint(),c=a.getFillRadialGradientEndPoint(),d=a.getFillRadialGradientStartRadius(),e=a.getFillRadialGradientEndRadius(),f=a.getFillRadialGradientColorStops(),g=this.createRadialGradient(b.x,b.y,d,c.x,c.y,e),h=0;h<f.length;h+=2)g.addColorStop(f[h],f[h+1]);this.setAttr("fillStyle",g),this.fill()},_fill:function(a){var b=a.fill()||a.fillRed()||a.fillGreen()||a.fillBlue(),c=a.getFillPatternImage(),d=a.getFillLinearGradientColorStops(),e=a.getFillRadialGradientColorStops(),f=a.getFillPriority();b&&"color"===f?this._fillColor(a):c&&"pattern"===f?this._fillPattern(a):d&&"linear-gradient"===f?this._fillLinearGradient(a):e&&"radial-gradient"===f?this._fillRadialGradient(a):b?this._fillColor(a):c?this._fillPattern(a):d?this._fillLinearGradient(a):e&&this._fillRadialGradient(a)},_stroke:function(a){var b=a.dash(),c=a.getStrokeScaleEnabled();a.hasStroke()&&(c||(this.save(),this.setTransform(1,0,0,1,0,0)),this._applyLineCap(a),b&&a.dashEnabled()&&this.setLineDash(b),this.setAttr("lineWidth",a.strokeWidth()),this.setAttr("strokeStyle",a.stroke()||Kinetic.Util._getRGBAString({red:a.strokeRed(),green:a.strokeGreen(),blue:a.strokeBlue(),alpha:a.strokeAlpha()})),a._strokeFunc(this),c||this.restore())},_applyShadow:function(a){var b=Kinetic.Util,c=a.getAbsoluteOpacity(),d=b.get(a.getShadowColor(),"black"),e=b.get(a.getShadowBlur(),5),f=b.get(a.getShadowOpacity(),1),g=b.get(a.getShadowOffset(),{x:0,y:0});f&&this.setAttr("globalAlpha",f*c),this.setAttr("shadowColor",d),this.setAttr("shadowBlur",e),this.setAttr("shadowOffsetX",g.x),this.setAttr("shadowOffsetY",g.y)}},Kinetic.Util.extend(Kinetic.SceneContext,Kinetic.Context),Kinetic.HitContext=function(a){Kinetic.Context.call(this,a)},Kinetic.HitContext.prototype={_fill:function(a){this.save(),this.setAttr("fillStyle",a.colorKey),a._fillFuncHit(this),this.restore()},_stroke:function(a){a.hasStroke()&&(this._applyLineCap(a),this.setAttr("lineWidth",a.strokeWidth()),this.setAttr("strokeStyle",a.colorKey),a._strokeFuncHit(this))}},Kinetic.Util.extend(Kinetic.HitContext,Kinetic.Context)}(),function(){var a="get",b="set";Kinetic.Factory={addGetterSetter:function(a,b,c,d,e){this.addGetter(a,b,c),this.addSetter(a,b,d,e),this.addOverloadedGetterSetter(a,b)},addGetter:function(b,c,d){var e=a+Kinetic.Util._capitalize(c);b.prototype[e]=function(){var a=this.attrs[c];return void 0===a?d:a}},addSetter:function(a,c,d,e){var f=b+Kinetic.Util._capitalize(c);a.prototype[f]=function(a){return d&&(a=d.call(this,a)),this._setAttr(c,a),e&&e.call(this),this}},addComponentsGetterSetter:function(c,d,e,f,g){var h,i,j=e.length,k=Kinetic.Util._capitalize,l=a+k(d),m=b+k(d);c.prototype[l]=function(){var a={};for(h=0;j>h;h++)i=e[h],a[i]=this.getAttr(d+k(i));return a},c.prototype[m]=function(a){var b,c=this.attrs[d];f&&(a=f.call(this,a));for(b in a)this._setAttr(d+k(b),a[b]);return this._fireChangeEvent(d,c,a),g&&g.call(this),this},this.addOverloadedGetterSetter(c,d)},addOverloadedGetterSetter:function(c,d){var e=Kinetic.Util._capitalize(d),f=b+e,g=a+e;c.prototype[d]=function(){return arguments.length?(this[f](arguments[0]),this):this[g]()}},backCompat:function(a,b){var c;for(c in b)a.prototype[c]=a.prototype[b[c]]},afterSetFilter:function(){this._filterUpToDate=!1}},Kinetic.Validators={RGBComponent:function(a){return a>255?255:0>a?0:Math.round(a)},alphaComponent:function(a){return a>1?1:1e-4>a?1e-4:a}}}(),function(){var a="absoluteOpacity",b="absoluteTransform",c="Change",d="children",e=".",f="",g="get",h="id",i="kinetic",j="listening",k="mouseenter",l="mouseleave",m="name",n="set",o="Shape",p=" ",q="stage",r="transform",s="Stage",t="visible",u=["id"],v=["xChange.kinetic","yChange.kinetic","scaleXChange.kinetic","scaleYChange.kinetic","skewXChange.kinetic","skewYChange.kinetic","rotationChange.kinetic","offsetXChange.kinetic","offsetYChange.kinetic","transformsEnabledChange.kinetic"].join(p);Kinetic.Util.addMethods(Kinetic.Node,{_init:function(c){var d=this;this._id=Kinetic.idCounter++,this.eventListeners={},this.attrs={},this._cache={},this._filterUpToDate=!1,this.setAttrs(c),this.on(v,function(){this._clearCache(r),d._clearSelfAndDescendantCache(b)}),this.on("visibleChange.kinetic",function(){d._clearSelfAndDescendantCache(t)}),this.on("listeningChange.kinetic",function(){d._clearSelfAndDescendantCache(j)}),this.on("opacityChange.kinetic",function(){d._clearSelfAndDescendantCache(a)})},_clearCache:function(a){a?delete this._cache[a]:this._cache={}},_getCache:function(a,b){var c=this._cache[a];return void 0===c&&(this._cache[a]=b.call(this)),this._cache[a]},_clearSelfAndDescendantCache:function(a){this._clearCache(a),this.children&&this.getChildren().each(function(b){b._clearSelfAndDescendantCache(a)})},clearCache:function(){return delete this._cache.canvas,this._filterUpToDate=!1,this},cache:function(a){var b=a||{},c=b.x||0,d=b.y||0,e=b.width||this.width(),f=b.height||this.height(),g=b.drawBorder||!1;if(0===e||0===f)return void Kinetic.Util.warn("Width or height of caching configuration equals 0. Cache is ignored.");var h=new Kinetic.SceneCanvas({pixelRatio:1,width:e,height:f}),i=new Kinetic.SceneCanvas({pixelRatio:1,width:e,height:f}),j=new Kinetic.HitCanvas({width:e,height:f}),k=h.getContext(),l=j.getContext();return j.isCache=!0,this.clearCache(),k.save(),l.save(),g&&(k.save(),k.beginPath(),k.rect(0,0,e,f),k.closePath(),k.setAttr("strokeStyle","red"),k.setAttr("lineWidth",5),k.stroke(),k.restore()),k.translate(-1*c,-1*d),l.translate(-1*c,-1*d),"Shape"===this.nodeType&&(k.translate(-1*this.x(),-1*this.y()),l.translate(-1*this.x(),-1*this.y())),this.drawScene(h,this),this.drawHit(j,this),k.restore(),l.restore(),this._cache.canvas={scene:h,filter:i,hit:j},this},_drawCachedSceneCanvas:function(a){a.save(),this.getLayer()._applyTransform(this,a),a._applyOpacity(this),a.drawImage(this._getCachedSceneCanvas()._canvas,0,0),a.restore()},_getCachedSceneCanvas:function(){var a,b,c,d,e=this.filters(),f=this._cache.canvas,g=f.scene,h=f.filter,i=h.getContext();if(e){if(!this._filterUpToDate){try{for(a=e.length,i.clear(),i.drawImage(g._canvas,0,0),b=i.getImageData(0,0,h.getWidth(),h.getHeight()),c=0;a>c;c++)d=e[c],d.call(this,b),i.putImageData(b,0,0)}catch(j){Kinetic.Util.warn("Unable to apply filter. "+j.message)}this._filterUpToDate=!0}return h}return g},_drawCachedHitCanvas:function(a){var b=this._cache.canvas,c=b.hit;a.save(),this.getLayer()._applyTransform(this,a),a.drawImage(c._canvas,0,0),a.restore()},on:function(a,b){var c,d,g,h,i,j=a.split(p),k=j.length;for(c=0;k>c;c++)d=j[c],g=d.split(e),h=g[0],i=g[1]||f,this.eventListeners[h]||(this.eventListeners[h]=[]),this.eventListeners[h].push({name:i,handler:b});return this},off:function(a){var b,c,d,f,g,h,i=(a||"").split(p),j=i.length;if(!a)for(c in this.eventListeners)this._off(c);for(b=0;j>b;b++)if(d=i[b],f=d.split(e),g=f[0],h=f[1],g)this.eventListeners[g]&&this._off(g,h);else for(c in this.eventListeners)this._off(c,h);return this},dispatchEvent:function(a){var b={target:this,type:a.type,evt:a};this.fire(a.type,b)},addEventListener:function(a,b){this.on(a,function(a){b.call(this,a.evt)})},removeEventListener:function(a){this.off(a)},remove:function(){var c=this.getParent();return c&&c.children&&(c.children.splice(this.index,1),c._setChildrenIndices(),delete this.parent),this._clearSelfAndDescendantCache(q),this._clearSelfAndDescendantCache(b),this._clearSelfAndDescendantCache(t),this._clearSelfAndDescendantCache(j),this._clearSelfAndDescendantCache(a),this},destroy:function(){Kinetic._removeId(this.getId()),Kinetic._removeName(this.getName(),this._id),this.remove()},getAttr:function(a){var b=g+Kinetic.Util._capitalize(a);return Kinetic.Util._isFunction(this[b])?this[b]():this.attrs[a]},getAncestors:function(){for(var a=this.getParent(),b=new Kinetic.Collection;a;)b.push(a),a=a.getParent();return b},getAttrs:function(){return this.attrs||{}},setAttrs:function(a){var b,c;if(a)for(b in a)b===d||a[b]instanceof Kinetic.Node||(c=n+Kinetic.Util._capitalize(b),Kinetic.Util._isFunction(this[c])?this[c](a[b]):this._setAttr(b,a[b]));return this},isListening:function(){return this._getCache(j,this._isListening)},_isListening:function(){var a=this.getListening(),b=this.getParent();return"inherit"===a?b?b.isListening():!0:a},isVisible:function(){return this._getCache(t,this._isVisible)},_isVisible:function(){var a=this.getVisible(),b=this.getParent();return"inherit"===a?b?b.isVisible():!0:a},shouldDrawHit:function(a){var b=this.getLayer();return a&&a.isCache||b&&b.hitGraphEnabled()&&this.isListening()&&this.isVisible()},show:function(){return this.setVisible(!0),this},hide:function(){return this.setVisible(!1),this},getZIndex:function(){return this.index||0},getAbsoluteZIndex:function(){function a(i){for(b=[],c=i.length,d=0;c>d;d++)e=i[d],h++,e.nodeType!==o&&(b=b.concat(e.getChildren().toArray())),e._id===g._id&&(d=c);b.length>0&&b[0].getDepth()<=f&&a(b)}var b,c,d,e,f=this.getDepth(),g=this,h=0;return g.nodeType!==s&&a(g.getStage().getChildren()),h},getDepth:function(){for(var a=0,b=this.parent;b;)a++,b=b.parent;return a},setPosition:function(a){return this.setX(a.x),this.setY(a.y),this},getPosition:function(){return{x:this.getX(),y:this.getY()}},getAbsolutePosition:function(){var a=this.getAbsoluteTransform().getMatrix(),b=new Kinetic.Transform,c=this.offset();return b.m=a.slice(),b.translate(c.x,c.y),b.getTranslation()},setAbsolutePosition:function(a){var b,c=this._clearTransform();return this.attrs.x=c.x,this.attrs.y=c.y,delete c.x,delete c.y,b=this.getAbsoluteTransform(),b.invert(),b.translate(a.x,a.y),a={x:this.attrs.x+b.getTranslation().x,y:this.attrs.y+b.getTranslation().y},this.setPosition({x:a.x,y:a.y}),this._setTransform(c),this},_setTransform:function(a){var c;for(c in a)this.attrs[c]=a[c];this._clearCache(r),this._clearSelfAndDescendantCache(b)},_clearTransform:function(){var a={x:this.getX(),y:this.getY(),rotation:this.getRotation(),scaleX:this.getScaleX(),scaleY:this.getScaleY(),offsetX:this.getOffsetX(),offsetY:this.getOffsetY(),skewX:this.getSkewX(),skewY:this.getSkewY()};return this.attrs.x=0,this.attrs.y=0,this.attrs.rotation=0,this.attrs.scaleX=1,this.attrs.scaleY=1,this.attrs.offsetX=0,this.attrs.offsetY=0,this.attrs.skewX=0,this.attrs.skewY=0,this._clearCache(r),this._clearSelfAndDescendantCache(b),a},move:function(a){var b=a.x,c=a.y,d=this.getX(),e=this.getY();return void 0!==b&&(d+=b),void 0!==c&&(e+=c),this.setPosition({x:d,y:e}),this},_eachAncestorReverse:function(a,b){var c,d,e=[],f=this.getParent();if(b&&b._id===this._id)return a(this),!0;for(e.unshift(this);f&&(!b||f._id!==b._id);)e.unshift(f),f=f.parent;for(c=e.length,d=0;c>d;d++)a(e[d])},rotate:function(a){return this.setRotation(this.getRotation()+a),this},moveToTop:function(){if(!this.parent)return void Kinetic.Util.warn("Node has no parent. moveToTop function is ignored.");var a=this.index;return this.parent.children.splice(a,1),this.parent.children.push(this),this.parent._setChildrenIndices(),!0},moveUp:function(){if(!this.parent)return void Kinetic.Util.warn("Node has no parent. moveUp function is ignored.");var a=this.index,b=this.parent.getChildren().length;return b-1>a?(this.parent.children.splice(a,1),this.parent.children.splice(a+1,0,this),this.parent._setChildrenIndices(),!0):!1},moveDown:function(){if(!this.parent)return void Kinetic.Util.warn("Node has no parent. moveDown function is ignored.");var a=this.index;return a>0?(this.parent.children.splice(a,1),this.parent.children.splice(a-1,0,this),this.parent._setChildrenIndices(),!0):!1},moveToBottom:function(){if(!this.parent)return void Kinetic.Util.warn("Node has no parent. moveToBottom function is ignored.");var a=this.index;return a>0?(this.parent.children.splice(a,1),this.parent.children.unshift(this),this.parent._setChildrenIndices(),!0):!1},setZIndex:function(a){if(!this.parent)return void Kinetic.Util.warn("Node has no parent. zIndex parameter is ignored.");var b=this.index;return this.parent.children.splice(b,1),this.parent.children.splice(a,0,this),this.parent._setChildrenIndices(),this},getAbsoluteOpacity:function(){return this._getCache(a,this._getAbsoluteOpacity)},_getAbsoluteOpacity:function(){var a=this.getOpacity();return this.getParent()&&(a*=this.getParent().getAbsoluteOpacity()),a},moveTo:function(a){return this.getParent()!==a&&(this.remove(),a.add(this)),this},toObject:function(){var a,b,c,d,e=Kinetic.Util,f={},g=this.getAttrs();f.attrs={};for(a in g)b=g[a],e._isFunction(b)||e._isElement(b)||e._isObject(b)&&e._hasMethods(b)||(c=this[a],delete g[a],d=c?c.call(this):null,g[a]=b,d!==b&&(f.attrs[a]=b));return f.className=this.getClassName(),f},toJSON:function(){return JSON.stringify(this.toObject())},getParent:function(){return this.parent},getLayer:function(){var a=this.getParent();return a?a.getLayer():null},getStage:function(){return this._getCache(q,this._getStage)},_getStage:function(){var a=this.getParent();return a?a.getStage():void 0},fire:function(a,b,c){return c?this._fireAndBubble(a,b||{}):this._fire(a,b||{}),this},getAbsoluteTransform:function(a){return a?this._getAbsoluteTransform(a):this._getCache(b,this._getAbsoluteTransform)},_getAbsoluteTransform:function(a){var b,c,d=new Kinetic.Transform;return this._eachAncestorReverse(function(a){b=a.transformsEnabled(),c=a.getTransform(),"all"===b?d.multiply(c):"position"===b&&d.translate(a.x(),a.y())},a),d},getTransform:function(){return this._getCache(r,this._getTransform)},_getTransform:function(){var a=new Kinetic.Transform,b=this.getX(),c=this.getY(),d=Kinetic.getAngle(this.getRotation()),e=this.getScaleX(),f=this.getScaleY(),g=this.getSkewX(),h=this.getSkewY(),i=this.getOffsetX(),j=this.getOffsetY();return(0!==b||0!==c)&&a.translate(b,c),0!==d&&a.rotate(d),(0!==g||0!==h)&&a.skew(g,h),(1!==e||1!==f)&&a.scale(e,f),(0!==i||0!==j)&&a.translate(-1*i,-1*j),a},clone:function(a){var b,c,d,e,f,g=this.getClassName(),h=Kinetic.Util.cloneObject(this.attrs);for(var j in u){var k=u[j];delete h[k]}for(b in a)h[b]=a[b];var l=new Kinetic[g](h);for(b in this.eventListeners)for(c=this.eventListeners[b],d=c.length,e=0;d>e;e++)f=c[e],f.name.indexOf(i)<0&&(l.eventListeners[b]||(l.eventListeners[b]=[]),l.eventListeners[b].push(f));return l},toDataURL:function(a){a=a||{};var b=a.mimeType||null,c=a.quality||null,d=this.getStage(),e=a.x||0,f=a.y||0,g=new Kinetic.SceneCanvas({width:a.width||this.getWidth()||(d?d.getWidth():0),height:a.height||this.getHeight()||(d?d.getHeight():0),pixelRatio:1}),h=g.getContext();return h.save(),(e||f)&&h.translate(-1*e,-1*f),this.drawScene(g),h.restore(),g.toDataURL(b,c)},toImage:function(a){Kinetic.Util._getImage(this.toDataURL(a),function(b){a.callback(b)})},setSize:function(a){return this.setWidth(a.width),this.setHeight(a.height),this},getSize:function(){return{width:this.getWidth(),height:this.getHeight()}},getWidth:function(){return this.attrs.width||0},getHeight:function(){return this.attrs.height||0},getClassName:function(){return this.className||this.nodeType},getType:function(){return this.nodeType},getDragDistance:function(){return void 0!==this.attrs.dragDistance?this.attrs.dragDistance:this.parent?this.parent.getDragDistance():Kinetic.dragDistance
},_get:function(a){return this.className===a||this.nodeType===a?[this]:[]},_off:function(a,b){var c,d,e=this.eventListeners[a];for(c=0;c<e.length;c++)if(d=e[c].name,!("kinetic"===d&&"kinetic"!==b||b&&d!==b)){if(e.splice(c,1),0===e.length){delete this.eventListeners[a];break}c--}},_fireChangeEvent:function(a,b,d){this._fire(a+c,{oldVal:b,newVal:d})},setId:function(a){var b=this.getId();return Kinetic._removeId(b),Kinetic._addId(this,a),this._setAttr(h,a),this},setName:function(a){var b=this.getName();return Kinetic._removeName(b,this._id),Kinetic._addName(this,a),this._setAttr(m,a),this},setAttr:function(a,b){var c=n+Kinetic.Util._capitalize(a),d=this[c];return Kinetic.Util._isFunction(d)?d.call(this,b):this._setAttr(a,b),this},_setAttr:function(a,b){var c;void 0!==b&&(c=this.attrs[a],this.attrs[a]=b,this._fireChangeEvent(a,c,b))},_setComponentAttr:function(a,b,c){var d;void 0!==c&&(d=this.attrs[a],d||(this.attrs[a]=this.getAttr(a)),this.attrs[a][b]=c,this._fireChangeEvent(a,d,c))},_fireAndBubble:function(a,b,c){var d=!0;if(b&&this.nodeType===o&&(b.target=this),a===k&&c&&(this._id===c._id||this.isAncestorOf&&this.isAncestorOf(c))?d=!1:a===l&&c&&(this._id===c._id||this.isAncestorOf&&this.isAncestorOf(c))&&(d=!1),d){this._fire(a,b);var e=(a===k||a===l)&&(c&&c.isAncestorOf&&c.isAncestorOf(this)||!(!c||!c.isAncestorOf));b&&!b.cancelBubble&&this.parent&&this.parent.isListening()&&!e&&(c&&c.parent?this._fireAndBubble.call(this.parent,a,b,c.parent):this._fireAndBubble.call(this.parent,a,b))}},_fire:function(a,b){var c,d=this.eventListeners[a];if(b.type=a,d)for(c=0;c<d.length;c++)d[c].handler.call(this,b)},draw:function(){return this.drawScene(),this.drawHit(),this}}),Kinetic.Node.create=function(a,b){return this._createNode(JSON.parse(a),b)},Kinetic.Node._createNode=function(a,b){var c,d,e,f=Kinetic.Node.prototype.getClassName.call(a),g=a.children;if(b&&(a.attrs.container=b),c=new Kinetic[f](a.attrs),g)for(d=g.length,e=0;d>e;e++)c.add(this._createNode(g[e]));return c},Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node,"position"),Kinetic.Factory.addGetterSetter(Kinetic.Node,"x",0),Kinetic.Factory.addGetterSetter(Kinetic.Node,"y",0),Kinetic.Factory.addGetterSetter(Kinetic.Node,"opacity",1),Kinetic.Factory.addGetter(Kinetic.Node,"name"),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node,"name"),Kinetic.Factory.addGetter(Kinetic.Node,"id"),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node,"id"),Kinetic.Factory.addGetterSetter(Kinetic.Node,"rotation",0),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Node,"scale",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Node,"scaleX",1),Kinetic.Factory.addGetterSetter(Kinetic.Node,"scaleY",1),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Node,"skew",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Node,"skewX",0),Kinetic.Factory.addGetterSetter(Kinetic.Node,"skewY",0),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Node,"offset",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Node,"offsetX",0),Kinetic.Factory.addGetterSetter(Kinetic.Node,"offsetY",0),Kinetic.Factory.addSetter(Kinetic.Node,"dragDistance"),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node,"dragDistance"),Kinetic.Factory.addSetter(Kinetic.Node,"width",0),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node,"width"),Kinetic.Factory.addSetter(Kinetic.Node,"height",0),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node,"height"),Kinetic.Factory.addGetterSetter(Kinetic.Node,"listening","inherit"),Kinetic.Factory.addGetterSetter(Kinetic.Node,"filters",void 0,function(a){return this._filterUpToDate=!1,a}),Kinetic.Factory.addGetterSetter(Kinetic.Node,"visible","inherit"),Kinetic.Factory.addGetterSetter(Kinetic.Node,"transformsEnabled","all"),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node,"size"),Kinetic.Factory.backCompat(Kinetic.Node,{rotateDeg:"rotate",setRotationDeg:"setRotation",getRotationDeg:"getRotation"}),Kinetic.Collection.mapMethods(Kinetic.Node)}(),function(){Kinetic.Filters.Grayscale=function(a){var b,c,d=a.data,e=d.length;for(b=0;e>b;b+=4)c=.34*d[b]+.5*d[b+1]+.16*d[b+2],d[b]=c,d[b+1]=c,d[b+2]=c}}(),function(){Kinetic.Filters.Brighten=function(a){var b,c=255*this.brightness(),d=a.data,e=d.length;for(b=0;e>b;b+=4)d[b]+=c,d[b+1]+=c,d[b+2]+=c},Kinetic.Factory.addGetterSetter(Kinetic.Node,"brightness",0,null,Kinetic.Factory.afterSetFilter)}(),function(){Kinetic.Filters.Invert=function(a){var b,c=a.data,d=c.length;for(b=0;d>b;b+=4)c[b]=255-c[b],c[b+1]=255-c[b+1],c[b+2]=255-c[b+2]}}(),function(){function a(){this.r=0,this.g=0,this.b=0,this.a=0,this.next=null}function b(b,e){var f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D=b.data,E=b.width,F=b.height,G=e+e+1,H=E-1,I=F-1,J=e+1,K=J*(J+1)/2,L=new a,M=null,N=L,O=null,P=null,Q=c[e],R=d[e];for(h=1;G>h;h++)N=N.next=new a,h==J&&(M=N);for(N.next=L,l=k=0,g=0;F>g;g++){for(u=v=w=x=m=n=o=p=0,q=J*(y=D[k]),r=J*(z=D[k+1]),s=J*(A=D[k+2]),t=J*(B=D[k+3]),m+=K*y,n+=K*z,o+=K*A,p+=K*B,N=L,h=0;J>h;h++)N.r=y,N.g=z,N.b=A,N.a=B,N=N.next;for(h=1;J>h;h++)i=k+((h>H?H:h)<<2),m+=(N.r=y=D[i])*(C=J-h),n+=(N.g=z=D[i+1])*C,o+=(N.b=A=D[i+2])*C,p+=(N.a=B=D[i+3])*C,u+=y,v+=z,w+=A,x+=B,N=N.next;for(O=L,P=M,f=0;E>f;f++)D[k+3]=B=p*Q>>R,0!==B?(B=255/B,D[k]=(m*Q>>R)*B,D[k+1]=(n*Q>>R)*B,D[k+2]=(o*Q>>R)*B):D[k]=D[k+1]=D[k+2]=0,m-=q,n-=r,o-=s,p-=t,q-=O.r,r-=O.g,s-=O.b,t-=O.a,i=l+((i=f+e+1)<H?i:H)<<2,u+=O.r=D[i],v+=O.g=D[i+1],w+=O.b=D[i+2],x+=O.a=D[i+3],m+=u,n+=v,o+=w,p+=x,O=O.next,q+=y=P.r,r+=z=P.g,s+=A=P.b,t+=B=P.a,u-=y,v-=z,w-=A,x-=B,P=P.next,k+=4;l+=E}for(f=0;E>f;f++){for(v=w=x=u=n=o=p=m=0,k=f<<2,q=J*(y=D[k]),r=J*(z=D[k+1]),s=J*(A=D[k+2]),t=J*(B=D[k+3]),m+=K*y,n+=K*z,o+=K*A,p+=K*B,N=L,h=0;J>h;h++)N.r=y,N.g=z,N.b=A,N.a=B,N=N.next;for(j=E,h=1;e>=h;h++)k=j+f<<2,m+=(N.r=y=D[k])*(C=J-h),n+=(N.g=z=D[k+1])*C,o+=(N.b=A=D[k+2])*C,p+=(N.a=B=D[k+3])*C,u+=y,v+=z,w+=A,x+=B,N=N.next,I>h&&(j+=E);for(k=f,O=L,P=M,g=0;F>g;g++)i=k<<2,D[i+3]=B=p*Q>>R,B>0?(B=255/B,D[i]=(m*Q>>R)*B,D[i+1]=(n*Q>>R)*B,D[i+2]=(o*Q>>R)*B):D[i]=D[i+1]=D[i+2]=0,m-=q,n-=r,o-=s,p-=t,q-=O.r,r-=O.g,s-=O.b,t-=O.a,i=f+((i=g+J)<I?i:I)*E<<2,m+=u+=O.r=D[i],n+=v+=O.g=D[i+1],o+=w+=O.b=D[i+2],p+=x+=O.a=D[i+3],O=O.next,q+=y=P.r,r+=z=P.g,s+=A=P.b,t+=B=P.a,u-=y,v-=z,w-=A,x-=B,P=P.next,k+=E}}var c=[512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,289,287,285,282,280,278,275,273,271,269,267,265,263,261,259],d=[9,11,12,13,13,14,14,15,15,15,15,16,16,16,16,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,18,19,19,19,19,19,19,19,19,19,19,19,19,19,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24];Kinetic.Filters.Blur=function(a){var c=Math.round(this.blurRadius());c>0&&b(a,c)},Kinetic.Factory.addGetterSetter(Kinetic.Node,"blurRadius",0,null,Kinetic.Factory.afterSetFilter)}(),function(){function a(a,b,c){var d=4*(c*a.width+b),e=[];return e.push(a.data[d++],a.data[d++],a.data[d++],a.data[d++]),e}function b(a,b){return Math.sqrt(Math.pow(a[0]-b[0],2)+Math.pow(a[1]-b[1],2)+Math.pow(a[2]-b[2],2))}function c(a){for(var b=[0,0,0],c=0;c<a.length;c++)b[0]+=a[c][0],b[1]+=a[c][1],b[2]+=a[c][2];return b[0]/=a.length,b[1]/=a.length,b[2]/=a.length,b}function d(d,e){var f=a(d,0,0),g=a(d,d.width-1,0),h=a(d,0,d.height-1),i=a(d,d.width-1,d.height-1),j=e||10;if(b(f,g)<j&&b(g,i)<j&&b(i,h)<j&&b(h,f)<j){for(var k=c([g,f,i,h]),l=[],m=0;m<d.width*d.height;m++){var n=b(k,[d.data[4*m],d.data[4*m+1],d.data[4*m+2]]);l[m]=j>n?0:255}return l}}function e(a,b){for(var c=0;c<a.width*a.height;c++)a.data[4*c+3]=b[c]}function f(a,b,c){for(var d=[1,1,1,1,0,1,1,1,1],e=Math.round(Math.sqrt(d.length)),f=Math.floor(e/2),g=[],h=0;c>h;h++)for(var i=0;b>i;i++){for(var j=h*b+i,k=0,l=0;e>l;l++)for(var m=0;e>m;m++){var n=h+l-f,o=i+m-f;if(n>=0&&c>n&&o>=0&&b>o){var p=n*b+o,q=d[l*e+m];k+=a[p]*q}}g[j]=2040===k?255:0}return g}function g(a,b,c){for(var d=[1,1,1,1,1,1,1,1,1],e=Math.round(Math.sqrt(d.length)),f=Math.floor(e/2),g=[],h=0;c>h;h++)for(var i=0;b>i;i++){for(var j=h*b+i,k=0,l=0;e>l;l++)for(var m=0;e>m;m++){var n=h+l-f,o=i+m-f;if(n>=0&&c>n&&o>=0&&b>o){var p=n*b+o,q=d[l*e+m];k+=a[p]*q}}g[j]=k>=1020?255:0}return g}function h(a,b,c){for(var d=[1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9],e=Math.round(Math.sqrt(d.length)),f=Math.floor(e/2),g=[],h=0;c>h;h++)for(var i=0;b>i;i++){for(var j=h*b+i,k=0,l=0;e>l;l++)for(var m=0;e>m;m++){var n=h+l-f,o=i+m-f;if(n>=0&&c>n&&o>=0&&b>o){var p=n*b+o,q=d[l*e+m];k+=a[p]*q}}g[j]=k}return g}Kinetic.Filters.Mask=function(a){var b=this.threshold(),c=d(a,b);return c&&(c=f(c,a.width,a.height),c=g(c,a.width,a.height),c=h(c,a.width,a.height),e(a,c)),a},Kinetic.Factory.addGetterSetter(Kinetic.Node,"threshold",0,null,Kinetic.Factory.afterSetFilter)}(),function(){Kinetic.Filters.RGB=function(a){var b,c,d=a.data,e=d.length,f=this.red(),g=this.green(),h=this.blue();for(b=0;e>b;b+=4)c=(.34*d[b]+.5*d[b+1]+.16*d[b+2])/255,d[b]=c*f,d[b+1]=c*g,d[b+2]=c*h,d[b+3]=d[b+3]},Kinetic.Factory.addGetterSetter(Kinetic.Node,"red",0,function(a){return this._filterUpToDate=!1,a>255?255:0>a?0:Math.round(a)}),Kinetic.Factory.addGetterSetter(Kinetic.Node,"green",0,function(a){return this._filterUpToDate=!1,a>255?255:0>a?0:Math.round(a)}),Kinetic.Factory.addGetterSetter(Kinetic.Node,"blue",0,Kinetic.Validators.RGBComponent,Kinetic.Factory.afterSetFilter)}(),function(){Kinetic.Filters.HSV=function(a){var b,c,d,e,f,g=a.data,h=g.length,i=Math.pow(2,this.value()),j=Math.pow(2,this.saturation()),k=Math.abs(this.hue()+360)%360,l=i*j*Math.cos(k*Math.PI/180),m=i*j*Math.sin(k*Math.PI/180),n=.299*i+.701*l+.167*m,o=.587*i-.587*l+.33*m,p=.114*i-.114*l-.497*m,q=.299*i-.299*l-.328*m,r=.587*i+.413*l+.035*m,s=.114*i-.114*l+.293*m,t=.299*i-.3*l+1.25*m,u=.587*i-.586*l-1.05*m,v=.114*i+.886*l-.2*m;for(b=0;h>b;b+=4)c=g[b+0],d=g[b+1],e=g[b+2],f=g[b+3],g[b+0]=n*c+o*d+p*e,g[b+1]=q*c+r*d+s*e,g[b+2]=t*c+u*d+v*e,g[b+3]=f},Kinetic.Factory.addGetterSetter(Kinetic.Node,"hue",0,null,Kinetic.Factory.afterSetFilter),Kinetic.Factory.addGetterSetter(Kinetic.Node,"saturation",0,null,Kinetic.Factory.afterSetFilter),Kinetic.Factory.addGetterSetter(Kinetic.Node,"value",0,null,Kinetic.Factory.afterSetFilter)}(),function(){Kinetic.Factory.addGetterSetter(Kinetic.Node,"hue",0,null,Kinetic.Factory.afterSetFilter),Kinetic.Factory.addGetterSetter(Kinetic.Node,"saturation",0,null,Kinetic.Factory.afterSetFilter),Kinetic.Factory.addGetterSetter(Kinetic.Node,"luminance",0,null,Kinetic.Factory.afterSetFilter),Kinetic.Filters.HSL=function(a){var b,c,d,e,f,g=a.data,h=g.length,i=1,j=Math.pow(2,this.saturation()),k=Math.abs(this.hue()+360)%360,l=127*this.luminance(),m=i*j*Math.cos(k*Math.PI/180),n=i*j*Math.sin(k*Math.PI/180),o=.299*i+.701*m+.167*n,p=.587*i-.587*m+.33*n,q=.114*i-.114*m-.497*n,r=.299*i-.299*m-.328*n,s=.587*i+.413*m+.035*n,t=.114*i-.114*m+.293*n,u=.299*i-.3*m+1.25*n,v=.587*i-.586*m-1.05*n,w=.114*i+.886*m-.2*n;for(b=0;h>b;b+=4)c=g[b+0],d=g[b+1],e=g[b+2],f=g[b+3],g[b+0]=o*c+p*d+q*e+l,g[b+1]=r*c+s*d+t*e+l,g[b+2]=u*c+v*d+w*e+l,g[b+3]=f}}(),function(){Kinetic.Filters.Emboss=function(a){var b=10*this.embossStrength(),c=255*this.embossWhiteLevel(),d=this.embossDirection(),e=this.embossBlend(),f=0,g=0,h=a.data,i=a.width,j=a.height,k=4*i,l=j;switch(d){case"top-left":f=-1,g=-1;break;case"top":f=-1,g=0;break;case"top-right":f=-1,g=1;break;case"right":f=0,g=1;break;case"bottom-right":f=1,g=1;break;case"bottom":f=1,g=0;break;case"bottom-left":f=1,g=-1;break;case"left":f=0,g=-1}do{var m=(l-1)*k,n=f;1>l+n&&(n=0),l+n>j&&(n=0);var o=(l-1+n)*i*4,p=i;do{var q=m+4*(p-1),r=g;1>p+r&&(r=0),p+r>i&&(r=0);var s=o+4*(p-1+r),t=h[q]-h[s],u=h[q+1]-h[s+1],v=h[q+2]-h[s+2],w=t,x=w>0?w:-w,y=u>0?u:-u,z=v>0?v:-v;if(y>x&&(w=u),z>x&&(w=v),w*=b,e){var A=h[q]+w,B=h[q+1]+w,C=h[q+2]+w;h[q]=A>255?255:0>A?0:A,h[q+1]=B>255?255:0>B?0:B,h[q+2]=C>255?255:0>C?0:C}else{var D=c-w;0>D?D=0:D>255&&(D=255),h[q]=h[q+1]=h[q+2]=D}}while(--p)}while(--l)},Kinetic.Factory.addGetterSetter(Kinetic.Node,"embossStrength",.5,null,Kinetic.Factory.afterSetFilter),Kinetic.Factory.addGetterSetter(Kinetic.Node,"embossWhiteLevel",.5,null,Kinetic.Factory.afterSetFilter),Kinetic.Factory.addGetterSetter(Kinetic.Node,"embossDirection","top-left",null,Kinetic.Factory.afterSetFilter),Kinetic.Factory.addGetterSetter(Kinetic.Node,"embossBlend",!1,null,Kinetic.Factory.afterSetFilter)}(),function(){function a(a,b,c,d,e){var f,g=c-b,h=e-d;return 0===g?d+h/2:0===h?d:(f=(a-b)/g,f=h*f+d)}Kinetic.Filters.Enhance=function(b){var c,d,e,f,g=b.data,h=g.length,i=g[0],j=i,k=g[1],l=k,m=g[2],n=m,o=this.enhance();if(0!==o){for(f=0;h>f;f+=4)c=g[f+0],i>c?i=c:c>j&&(j=c),d=g[f+1],k>d?k=d:d>l&&(l=d),e=g[f+2],m>e?m=e:e>n&&(n=e);j===i&&(j=255,i=0),l===k&&(l=255,k=0),n===m&&(n=255,m=0);var p,q,r,s,t,u,v,w,x;for(o>0?(q=j+o*(255-j),r=i-o*(i-0),t=l+o*(255-l),u=k-o*(k-0),w=n+o*(255-n),x=m-o*(m-0)):(p=.5*(j+i),q=j+o*(j-p),r=i+o*(i-p),s=.5*(l+k),t=l+o*(l-s),u=k+o*(k-s),v=.5*(n+m),w=n+o*(n-v),x=m+o*(m-v)),f=0;h>f;f+=4)g[f+0]=a(g[f+0],i,j,r,q),g[f+1]=a(g[f+1],k,l,u,t),g[f+2]=a(g[f+2],m,n,x,w)}},Kinetic.Factory.addGetterSetter(Kinetic.Node,"enhance",0,null,Kinetic.Factory.afterSetFilter)}(),function(){Kinetic.Filters.Posterize=function(a){var b,c=Math.round(254*this.levels())+1,d=a.data,e=d.length,f=255/c;for(b=0;e>b;b+=1)d[b]=Math.floor(d[b]/f)*f},Kinetic.Factory.addGetterSetter(Kinetic.Node,"levels",.5,null,Kinetic.Factory.afterSetFilter)}(),function(){Kinetic.Filters.Noise=function(a){var b,c=255*this.noise(),d=a.data,e=d.length,f=c/2;for(b=0;e>b;b+=4)d[b+0]+=f-2*f*Math.random(),d[b+1]+=f-2*f*Math.random(),d[b+2]+=f-2*f*Math.random()},Kinetic.Factory.addGetterSetter(Kinetic.Node,"noise",.2,null,Kinetic.Factory.afterSetFilter)}(),function(){Kinetic.Filters.Pixelate=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p=Math.ceil(this.pixelSize()),q=a.width,r=a.height,s=Math.ceil(q/p),t=Math.ceil(r/p);for(a=a.data,m=0;s>m;m+=1)for(n=0;t>n;n+=1){for(e=0,f=0,g=0,h=0,i=m*p,j=i+p,k=n*p,l=k+p,o=0,b=i;j>b;b+=1)if(!(b>=q))for(c=k;l>c;c+=1)c>=r||(d=4*(q*c+b),e+=a[d+0],f+=a[d+1],g+=a[d+2],h+=a[d+3],o+=1);for(e/=o,f/=o,g/=o,b=i;j>b;b+=1)if(!(b>=q))for(c=k;l>c;c+=1)c>=r||(d=4*(q*c+b),a[d+0]=e,a[d+1]=f,a[d+2]=g,a[d+3]=h)}},Kinetic.Factory.addGetterSetter(Kinetic.Node,"pixelSize",8,null,Kinetic.Factory.afterSetFilter)}(),function(){Kinetic.Filters.Threshold=function(a){var b,c=255*this.threshold(),d=a.data,e=d.length;for(b=0;e>b;b+=1)d[b]=d[b]<c?0:255},Kinetic.Factory.addGetterSetter(Kinetic.Node,"threshold",.5,null,Kinetic.Factory.afterSetFilter)}(),function(){Kinetic.Filters.Sepia=function(a){var b,c,d,e,f,g,h,i,j,k=a.data,l=a.width,m=a.height,n=4*l;do{b=(m-1)*n,c=l;do d=b+4*(c-1),e=k[d],f=k[d+1],g=k[d+2],h=.393*e+.769*f+.189*g,i=.349*e+.686*f+.168*g,j=.272*e+.534*f+.131*g,k[d]=h>255?255:h,k[d+1]=i>255?255:i,k[d+2]=j>255?255:j,k[d+3]=k[d+3];while(--c)}while(--m)}}(),function(){Kinetic.Filters.Solarize=function(a){var b=a.data,c=a.width,d=a.height,e=4*c,f=d;do{var g=(f-1)*e,h=c;do{var i=g+4*(h-1),j=b[i],k=b[i+1],l=b[i+2];j>127&&(j=255-j),k>127&&(k=255-k),l>127&&(l=255-l),b[i]=j,b[i+1]=k,b[i+2]=l}while(--h)}while(--f)}}(),function(){var a=function(a,b,c){var d,e,f,g,h=a.data,i=b.data,j=a.width,k=a.height,l=c.polarCenterX||j/2,m=c.polarCenterY||k/2,n=0,o=0,p=0,q=0,r=Math.sqrt(l*l+m*m);e=j-l,f=k-m,g=Math.sqrt(e*e+f*f),r=g>r?g:r;var s,t,u,v,w=k,x=j,y=360/x*Math.PI/180;for(t=0;x>t;t+=1)for(u=Math.sin(t*y),v=Math.cos(t*y),s=0;w>s;s+=1)e=Math.floor(l+r*s/w*v),f=Math.floor(m+r*s/w*u),d=4*(f*j+e),n=h[d+0],o=h[d+1],p=h[d+2],q=h[d+3],d=4*(t+s*j),i[d+0]=n,i[d+1]=o,i[d+2]=p,i[d+3]=q},b=function(a,b,c){var d,e,f,g,h,i,j=a.data,k=b.data,l=a.width,m=a.height,n=c.polarCenterX||l/2,o=c.polarCenterY||m/2,p=0,q=0,r=0,s=0,t=Math.sqrt(n*n+o*o);e=l-n,f=m-o,i=Math.sqrt(e*e+f*f),t=i>t?i:t;var u,v,w,x,y=m,z=l,A=c.polarRotation||0;for(e=0;l>e;e+=1)for(f=0;m>f;f+=1)g=e-n,h=f-o,u=Math.sqrt(g*g+h*h)*y/t,v=(180*Math.atan2(h,g)/Math.PI+360+A)%360,v=v*z/360,w=Math.floor(v),x=Math.floor(u),d=4*(x*l+w),p=j[d+0],q=j[d+1],r=j[d+2],s=j[d+3],d=4*(f*l+e),k[d+0]=p,k[d+1]=q,k[d+2]=r,k[d+3]=s},c=Kinetic.Util.createCanvasElement();Kinetic.Filters.Kaleidoscope=function(d){var e,f,g,h,i,j,k,l,m,n,o=d.width,p=d.height,q=Math.round(this.kaleidoscopePower()),r=Math.round(this.kaleidoscopeAngle()),s=Math.floor(o*(r%360)/360);if(!(1>q)){c.width=o,c.height=p;var t=c.getContext("2d").getImageData(0,0,o,p);a(d,t,{polarCenterX:o/2,polarCenterY:p/2});for(var u=o/Math.pow(2,q);8>=u;)u=2*u,q-=1;u=Math.ceil(u);var v=u,w=0,x=v,y=1;for(s+u>o&&(w=v,x=0,y=-1),f=0;p>f;f+=1)for(e=w;e!==x;e+=y)g=Math.round(e+s)%o,m=4*(o*f+g),i=t.data[m+0],j=t.data[m+1],k=t.data[m+2],l=t.data[m+3],n=4*(o*f+e),t.data[n+0]=i,t.data[n+1]=j,t.data[n+2]=k,t.data[n+3]=l;for(f=0;p>f;f+=1)for(v=Math.floor(u),h=0;q>h;h+=1){for(e=0;v+1>e;e+=1)m=4*(o*f+e),i=t.data[m+0],j=t.data[m+1],k=t.data[m+2],l=t.data[m+3],n=4*(o*f+2*v-e-1),t.data[n+0]=i,t.data[n+1]=j,t.data[n+2]=k,t.data[n+3]=l;v*=2}b(t,d,{polarRotation:0})}},Kinetic.Factory.addGetterSetter(Kinetic.Node,"kaleidoscopePower",2,null,Kinetic.Factory.afterSetFilter),Kinetic.Factory.addGetterSetter(Kinetic.Node,"kaleidoscopeAngle",0,null,Kinetic.Factory.afterSetFilter)}(),function(){function a(a){setTimeout(a,1e3/60)}function b(){return e.apply(Kinetic.root,arguments)}var c=500,d=function(){return Kinetic.root.performance&&Kinetic.root.performance.now?function(){return Kinetic.root.performance.now()}:function(){return(new Date).getTime()}}(),e=function(){return Kinetic.root.requestAnimationFrame||Kinetic.root.webkitRequestAnimationFrame||Kinetic.root.mozRequestAnimationFrame||Kinetic.root.oRequestAnimationFrame||Kinetic.root.msRequestAnimationFrame||a}();Kinetic.Animation=function(a,b){var c=Kinetic.Animation;this.func=a,this.setLayers(b),this.id=c.animIdCounter++,this.frame={time:0,timeDiff:0,lastTime:d()}},Kinetic.Animation.prototype={setLayers:function(a){var b=[];b=a?a.length>0?a:[a]:[],this.layers=b},getLayers:function(){return this.layers},addLayer:function(a){var b,c,d=this.layers;if(d){for(b=d.length,c=0;b>c;c++)if(d[c]._id===a._id)return!1}else this.layers=[];return this.layers.push(a),!0},isRunning:function(){var a,b=Kinetic.Animation,c=b.animations,d=c.length;for(a=0;d>a;a++)if(c[a].id===this.id)return!0;return!1},start:function(){var a=Kinetic.Animation;this.stop(),this.frame.timeDiff=0,this.frame.lastTime=d(),a._addAnimation(this)},stop:function(){Kinetic.Animation._removeAnimation(this)},_updateFrameObject:function(a){this.frame.timeDiff=a-this.frame.lastTime,this.frame.lastTime=a,this.frame.time+=this.frame.timeDiff,this.frame.frameRate=1e3/this.frame.timeDiff}},Kinetic.Animation.animations=[],Kinetic.Animation.animIdCounter=0,Kinetic.Animation.animRunning=!1,Kinetic.Animation._addAnimation=function(a){this.animations.push(a),this._handleAnimation()},Kinetic.Animation._removeAnimation=function(a){var b,c=a.id,d=this.animations,e=d.length;for(b=0;e>b;b++)if(d[b].id===c){this.animations.splice(b,1);break}},Kinetic.Animation._runFrames=function(){var a,b,c,e,f,g,h,i,j,k={},l=this.animations;for(e=0;e<l.length;e++)if(a=l[e],b=a.layers,c=a.func,a._updateFrameObject(d()),g=b.length,j=c?c.call(a,a.frame)!==!1:!0)for(f=0;g>f;f++)h=b[f],void 0!==h._id&&(k[h._id]=h);for(i in k)k[i].draw()},Kinetic.Animation._animationLoop=function(){var a=Kinetic.Animation;a.animations.length?(b(a._animationLoop),a._runFrames()):a.animRunning=!1},Kinetic.Animation._handleAnimation=function(){var a=this;this.animRunning||(this.animRunning=!0,a._animationLoop())};var f=Kinetic.Node.prototype.moveTo;Kinetic.Node.prototype.moveTo=function(a){f.call(this,a)},Kinetic.BaseLayer.prototype.batchDraw=function(){var a=this,b=Kinetic.Animation;this.batchAnim||(this.batchAnim=new b(function(){a.lastBatchDrawTime&&d()-a.lastBatchDrawTime>c&&a.batchAnim.stop()},this)),this.lastBatchDrawTime=d(),this.batchAnim.isRunning()||(this.draw(),this.batchAnim.start())},Kinetic.Stage.prototype.batchDraw=function(){this.getChildren().each(function(a){a.batchDraw()})}}(this),function(){var a={node:1,duration:1,easing:1,onFinish:1,yoyo:1},b=1,c=2,d=3,e=0;Kinetic.Tween=function(b){var c,d,g=this,h=b.node,i=h._id,j=b.easing||Kinetic.Easings.Linear,k=!!b.yoyo;c="undefined"==typeof b.duration?1:0===b.duration?.001:b.duration,this.node=h,this._id=e++,this.anim=new Kinetic.Animation(function(){g.tween.onEnterFrame()},h.getLayer()||(h instanceof Kinetic.Stage?h.getLayers():null)),this.tween=new f(d,function(a){g._tweenFunc(a)},j,0,1,1e3*c,k),this._addListeners(),Kinetic.Tween.attrs[i]||(Kinetic.Tween.attrs[i]={}),Kinetic.Tween.attrs[i][this._id]||(Kinetic.Tween.attrs[i][this._id]={}),Kinetic.Tween.tweens[i]||(Kinetic.Tween.tweens[i]={});for(d in b)void 0===a[d]&&this._addAttr(d,b[d]);this.reset(),this.onFinish=b.onFinish,this.onReset=b.onReset},Kinetic.Tween.attrs={},Kinetic.Tween.tweens={},Kinetic.Tween.prototype={_addAttr:function(a,b){var c,d,e,f,g,h=this.node,i=h._id;if(e=Kinetic.Tween.tweens[i][a],e&&delete Kinetic.Tween.attrs[i][e][a],c=h.getAttr(a),Kinetic.Util._isArray(b))for(d=[],g=b.length,f=0;g>f;f++)d.push(b[f]-c[f]);else d=b-c;Kinetic.Tween.attrs[i][this._id][a]={start:c,diff:d},Kinetic.Tween.tweens[i][a]=this._id},_tweenFunc:function(a){var b,c,d,e,f,g,h,i=this.node,j=Kinetic.Tween.attrs[i._id][this._id];for(b in j){if(c=j[b],d=c.start,e=c.diff,Kinetic.Util._isArray(d))for(f=[],h=d.length,g=0;h>g;g++)f.push(d[g]+e[g]*a);else f=d+e*a;i.setAttr(b,f)}},_addListeners:function(){var a=this;this.tween.onPlay=function(){a.anim.start()},this.tween.onReverse=function(){a.anim.start()},this.tween.onPause=function(){a.anim.stop()},this.tween.onFinish=function(){a.onFinish&&a.onFinish()},this.tween.onReset=function(){a.onReset&&a.onReset()}},play:function(){return this.tween.play(),this},reverse:function(){return this.tween.reverse(),this},reset:function(){return this.tween.reset(),this},seek:function(a){return this.tween.seek(1e3*a),this},pause:function(){return this.tween.pause(),this},finish:function(){return this.tween.finish(),this},destroy:function(){var a,b=this.node._id,c=this._id,d=Kinetic.Tween.tweens[b];this.pause();for(a in d)delete Kinetic.Tween.tweens[b][a];delete Kinetic.Tween.attrs[b][c]}};var f=function(a,b,c,d,e,f,g){this.prop=a,this.propFunc=b,this.begin=d,this._pos=d,this.duration=f,this._change=0,this.prevPos=0,this.yoyo=g,this._time=0,this._position=0,this._startTime=0,this._finish=0,this.func=c,this._change=e-this.begin,this.pause()};f.prototype={fire:function(a){var b=this[a];b&&b()},setTime:function(a){a>this.duration?this.yoyo?(this._time=this.duration,this.reverse()):this.finish():0>a?this.yoyo?(this._time=0,this.play()):this.reset():(this._time=a,this.update())},getTime:function(){return this._time},setPosition:function(a){this.prevPos=this._pos,this.propFunc(a),this._pos=a},getPosition:function(a){return void 0===a&&(a=this._time),this.func(a,this.begin,this._change,this.duration)},play:function(){this.state=c,this._startTime=this.getTimer()-this._time,this.onEnterFrame(),this.fire("onPlay")},reverse:function(){this.state=d,this._time=this.duration-this._time,this._startTime=this.getTimer()-this._time,this.onEnterFrame(),this.fire("onReverse")},seek:function(a){this.pause(),this._time=a,this.update(),this.fire("onSeek")},reset:function(){this.pause(),this._time=0,this.update(),this.fire("onReset")},finish:function(){this.pause(),this._time=this.duration,this.update(),this.fire("onFinish")},update:function(){this.setPosition(this.getPosition(this._time))},onEnterFrame:function(){var a=this.getTimer()-this._startTime;this.state===c?this.setTime(a):this.state===d&&this.setTime(this.duration-a)},pause:function(){this.state=b,this.fire("onPause")},getTimer:function(){return(new Date).getTime()}},Kinetic.Easings={BackEaseIn:function(a,b,c,d){var e=1.70158;return c*(a/=d)*a*((e+1)*a-e)+b},BackEaseOut:function(a,b,c,d){var e=1.70158;return c*((a=a/d-1)*a*((e+1)*a+e)+1)+b},BackEaseInOut:function(a,b,c,d){var e=1.70158;return(a/=d/2)<1?c/2*a*a*(((e*=1.525)+1)*a-e)+b:c/2*((a-=2)*a*(((e*=1.525)+1)*a+e)+2)+b},ElasticEaseIn:function(a,b,c,d,e,f){var g=0;return 0===a?b:1==(a/=d)?b+c:(f||(f=.3*d),!e||e<Math.abs(c)?(e=c,g=f/4):g=f/(2*Math.PI)*Math.asin(c/e),-(e*Math.pow(2,10*(a-=1))*Math.sin(2*(a*d-g)*Math.PI/f))+b)},ElasticEaseOut:function(a,b,c,d,e,f){var g=0;return 0===a?b:1==(a/=d)?b+c:(f||(f=.3*d),!e||e<Math.abs(c)?(e=c,g=f/4):g=f/(2*Math.PI)*Math.asin(c/e),e*Math.pow(2,-10*a)*Math.sin(2*(a*d-g)*Math.PI/f)+c+b)},ElasticEaseInOut:function(a,b,c,d,e,f){var g=0;return 0===a?b:2==(a/=d/2)?b+c:(f||(f=.3*d*1.5),!e||e<Math.abs(c)?(e=c,g=f/4):g=f/(2*Math.PI)*Math.asin(c/e),1>a?-.5*e*Math.pow(2,10*(a-=1))*Math.sin(2*(a*d-g)*Math.PI/f)+b:e*Math.pow(2,-10*(a-=1))*Math.sin(2*(a*d-g)*Math.PI/f)*.5+c+b)},BounceEaseOut:function(a,b,c,d){return(a/=d)<1/2.75?7.5625*c*a*a+b:2/2.75>a?c*(7.5625*(a-=1.5/2.75)*a+.75)+b:2.5/2.75>a?c*(7.5625*(a-=2.25/2.75)*a+.9375)+b:c*(7.5625*(a-=2.625/2.75)*a+.984375)+b},BounceEaseIn:function(a,b,c,d){return c-Kinetic.Easings.BounceEaseOut(d-a,0,c,d)+b},BounceEaseInOut:function(a,b,c,d){return d/2>a?.5*Kinetic.Easings.BounceEaseIn(2*a,0,c,d)+b:.5*Kinetic.Easings.BounceEaseOut(2*a-d,0,c,d)+.5*c+b},EaseIn:function(a,b,c,d){return c*(a/=d)*a+b},EaseOut:function(a,b,c,d){return-c*(a/=d)*(a-2)+b},EaseInOut:function(a,b,c,d){return(a/=d/2)<1?c/2*a*a+b:-c/2*(--a*(a-2)-1)+b},StrongEaseIn:function(a,b,c,d){return c*(a/=d)*a*a*a*a+b},StrongEaseOut:function(a,b,c,d){return c*((a=a/d-1)*a*a*a*a+1)+b},StrongEaseInOut:function(a,b,c,d){return(a/=d/2)<1?c/2*a*a*a*a*a+b:c/2*((a-=2)*a*a*a*a+2)+b},Linear:function(a,b,c,d){return c*a/d+b}}}(),function(){Kinetic.DD={anim:new Kinetic.Animation(function(){var a=this.dirty;return this.dirty=!1,a}),isDragging:!1,justDragged:!1,offset:{x:0,y:0},node:null,_drag:function(a){var b=Kinetic.DD,c=b.node;if(c){if(!b.isDragging){var d=c.getStage().getPointerPosition(),e=c.dragDistance(),f=Math.max(Math.abs(d.x-b.startPointerPos.x),Math.abs(d.y-b.startPointerPos.y));if(e>f)return}c._setDragPosition(a),b.isDragging||(b.isDragging=!0,c.fire("dragstart",{type:"dragstart",target:c,evt:a},!0)),c.fire("dragmove",{type:"dragmove",target:c,evt:a},!0)}},_endDragBefore:function(a){var b,c,d=Kinetic.DD,e=d.node;e&&(b=e.nodeType,c=e.getLayer(),d.anim.stop(),d.isDragging&&(d.isDragging=!1,d.justDragged=!0,Kinetic.listenClickTap=!1,a&&(a.dragEndNode=e)),delete d.node,(c||e).draw())},_endDragAfter:function(a){a=a||{};var b=a.dragEndNode;a&&b&&b.fire("dragend",{type:"dragend",target:b,evt:a},!0)}},Kinetic.Node.prototype.startDrag=function(){var a=Kinetic.DD,b=this.getStage(),c=this.getLayer(),d=b.getPointerPosition(),e=this.getAbsolutePosition();d&&(a.node&&a.node.stopDrag(),a.node=this,a.startPointerPos=d,a.offset.x=d.x-e.x,a.offset.y=d.y-e.y,a.anim.setLayers(c||this.getLayers()),a.anim.start(),this._setDragPosition())},Kinetic.Node.prototype._setDragPosition=function(a){var b=Kinetic.DD,c=this.getStage().getPointerPosition(),d=this.getDragBoundFunc();if(c){var e={x:c.x-b.offset.x,y:c.y-b.offset.y};void 0!==d&&(e=d.call(this,e,a)),this.setAbsolutePosition(e),this._lastPos&&this._lastPos.x===e.x&&this._lastPos.y===e.y||(b.anim.dirty=!0),this._lastPos=e}},Kinetic.Node.prototype.stopDrag=function(){var a=Kinetic.DD,b={};a._endDragBefore(b),a._endDragAfter(b)},Kinetic.Node.prototype.setDraggable=function(a){this._setAttr("draggable",a),this._dragChange()};var a=Kinetic.Node.prototype.destroy;Kinetic.Node.prototype.destroy=function(){var b=Kinetic.DD;b.node&&b.node._id===this._id&&this.stopDrag(),a.call(this)},Kinetic.Node.prototype.isDragging=function(){var a=Kinetic.DD;return!(!a.node||a.node._id!==this._id||!a.isDragging)},Kinetic.Node.prototype._listenDrag=function(){var a=this;this._dragCleanup(),"Stage"===this.getClassName()?this.on("contentMousedown.kinetic contentTouchstart.kinetic",function(b){Kinetic.DD.node||a.startDrag(b)}):this.on("mousedown.kinetic touchstart.kinetic",function(b){1!==b.evt.button&&2!==b.evt.button&&(Kinetic.DD.node||a.startDrag(b))})},Kinetic.Node.prototype._dragChange=function(){if(this.attrs.draggable)this._listenDrag();else{this._dragCleanup();var a=this.getStage(),b=Kinetic.DD;a&&b.node&&b.node._id===this._id&&b.node.stopDrag()}},Kinetic.Node.prototype._dragCleanup=function(){"Stage"===this.getClassName()?(this.off("contentMousedown.kinetic"),this.off("contentTouchstart.kinetic")):(this.off("mousedown.kinetic"),this.off("touchstart.kinetic"))},Kinetic.Factory.addGetterSetter(Kinetic.Node,"dragBoundFunc"),Kinetic.Factory.addGetter(Kinetic.Node,"draggable",!1),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node,"draggable");var b=Kinetic.document.documentElement;b.addEventListener("mouseup",Kinetic.DD._endDragBefore,!0),b.addEventListener("touchend",Kinetic.DD._endDragBefore,!0),b.addEventListener("mouseup",Kinetic.DD._endDragAfter,!1),b.addEventListener("touchend",Kinetic.DD._endDragAfter,!1)}(),function(){Kinetic.Util.addMethods(Kinetic.Container,{__init:function(a){this.children=new Kinetic.Collection,Kinetic.Node.call(this,a)},getChildren:function(a){if(a){var b=new Kinetic.Collection;return this.children.each(function(c){a(c)&&b.push(c)}),b}return this.children},hasChildren:function(){return this.getChildren().length>0},removeChildren:function(){for(var a,b=Kinetic.Collection.toCollection(this.children),c=0;c<b.length;c++)a=b[c],delete a.parent,a.index=0,a.hasChildren()&&a.removeChildren(),a.remove();return b=null,this.children=new Kinetic.Collection,this},destroyChildren:function(){for(var a,b=Kinetic.Collection.toCollection(this.children),c=0;c<b.length;c++)a=b[c],delete a.parent,a.index=0,a.destroy();return b=null,this.children=new Kinetic.Collection,this},add:function(a){if(arguments.length>1){for(var b=0;b<arguments.length;b++)this.add(arguments[b]);return this}if(a.getParent())return a.moveTo(this),this;var c=this.children;return this._validateAdd(a),a.index=c.length,a.parent=this,c.push(a),this._fire("add",{child:a}),a.isDragging()&&Kinetic.DD.anim.setLayers(a.getLayer()),this},destroy:function(){this.hasChildren()&&this.destroyChildren(),Kinetic.Node.prototype.destroy.call(this)},find:function(a){var b,c,d,e,f,g,h,i=[],j=a.replace(/ /g,"").split(","),k=j.length;for(b=0;k>b;b++)if(d=j[b],"#"===d.charAt(0))f=this._getNodeById(d.slice(1)),f&&i.push(f);else if("."===d.charAt(0))e=this._getNodesByName(d.slice(1)),i=i.concat(e);else for(g=this.getChildren(),h=g.length,c=0;h>c;c++)i=i.concat(g[c]._get(d));return Kinetic.Collection.toCollection(i)},_getNodeById:function(a){var b=Kinetic.ids[a];return void 0!==b&&this.isAncestorOf(b)?b:null},_getNodesByName:function(a){var b=Kinetic.names[a]||[];return this._getDescendants(b)},_get:function(a){for(var b=Kinetic.Node.prototype._get.call(this,a),c=this.getChildren(),d=c.length,e=0;d>e;e++)b=b.concat(c[e]._get(a));return b},toObject:function(){var a=Kinetic.Node.prototype.toObject.call(this);
a.children=[];for(var b=this.getChildren(),c=b.length,d=0;c>d;d++){var e=b[d];a.children.push(e.toObject())}return a},_getDescendants:function(a){for(var b=[],c=a.length,d=0;c>d;d++){var e=a[d];this.isAncestorOf(e)&&b.push(e)}return b},isAncestorOf:function(a){for(var b=a.getParent();b;){if(b._id===this._id)return!0;b=b.getParent()}return!1},clone:function(a){var b=Kinetic.Node.prototype.clone.call(this,a);return this.getChildren().each(function(a){b.add(a.clone())}),b},getAllIntersections:function(a){var b=[];return this.find("Shape").each(function(c){c.isVisible()&&c.intersects(a)&&b.push(c)}),b},_setChildrenIndices:function(){this.children.each(function(a,b){a.index=b})},drawScene:function(a,b){var c=this.getLayer(),d=a||c&&c.getCanvas(),e=d&&d.getContext(),f=this._cache.canvas,g=f&&f.scene;return this.isVisible()&&(g?this._drawCachedSceneCanvas(e):this._drawChildren(d,"drawScene",b)),this},drawHit:function(a,b){var c=this.getLayer(),d=a||c&&c.hitCanvas,e=d&&d.getContext(),f=this._cache.canvas,g=f&&f.hit;return this.shouldDrawHit(d)&&(c&&c.clearHitCache(),g?this._drawCachedHitCanvas(e):this._drawChildren(d,"drawHit",b)),this},_drawChildren:function(a,b,c){var d,e,f=this.getLayer(),g=a&&a.getContext(),h=this.getClipWidth(),i=this.getClipHeight(),j=h&&i;j&&f&&(d=this.getClipX(),e=this.getClipY(),g.save(),f._applyTransform(this,g),g.beginPath(),g.rect(d,e,h,i),g.clip(),g.reset()),this.children.each(function(d){d[b](a,c)}),j&&g.restore()},shouldDrawHit:function(a){var b=this.getLayer(),c=Kinetic.DD,d=c&&Kinetic.isDragging()&&-1!==Kinetic.DD.anim.getLayers().indexOf(b);return a&&a.isCache||b&&b.hitGraphEnabled()&&this.isVisible()&&!d}}),Kinetic.Util.extend(Kinetic.Container,Kinetic.Node),Kinetic.Container.prototype.get=Kinetic.Container.prototype.find,Kinetic.Factory.addComponentsGetterSetter(Kinetic.Container,"clip",["x","y","width","height"]),Kinetic.Factory.addGetterSetter(Kinetic.Container,"clipX"),Kinetic.Factory.addGetterSetter(Kinetic.Container,"clipY"),Kinetic.Factory.addGetterSetter(Kinetic.Container,"clipWidth"),Kinetic.Factory.addGetterSetter(Kinetic.Container,"clipHeight"),Kinetic.Collection.mapMethods(Kinetic.Container)}(),function(){function a(a){a.fill()}function b(a){a.stroke()}function c(a){a.fill()}function d(a){a.stroke()}function e(){this._clearCache(f)}var f="hasShadow";Kinetic.Util.addMethods(Kinetic.Shape,{__init:function(f){this.nodeType="Shape",this._fillFunc=a,this._strokeFunc=b,this._fillFuncHit=c,this._strokeFuncHit=d;for(var g,h=Kinetic.shapes;;)if(g=Kinetic.Util.getRandomColor(),g&&!(g in h))break;this.colorKey=g,h[g]=this,Kinetic.Node.call(this,f),this.on("shadowColorChange.kinetic shadowBlurChange.kinetic shadowOffsetChange.kinetic shadowOpacityChange.kinetic shadowEnabledChange.kinetic",e)},hasChildren:function(){return!1},getChildren:function(){return[]},getContext:function(){return this.getLayer().getContext()},getCanvas:function(){return this.getLayer().getCanvas()},hasShadow:function(){return this._getCache(f,this._hasShadow)},_hasShadow:function(){return this.getShadowEnabled()&&0!==this.getShadowOpacity()&&!!(this.getShadowColor()||this.getShadowBlur()||this.getShadowOffsetX()||this.getShadowOffsetY())},hasFill:function(){return!!(this.getFill()||this.getFillPatternImage()||this.getFillLinearGradientColorStops()||this.getFillRadialGradientColorStops())},hasStroke:function(){return!!(this.stroke()||this.strokeRed()||this.strokeGreen()||this.strokeBlue())},intersects:function(a){var b,c=this.getStage(),d=c.bufferHitCanvas;return d.getContext().clear(),this.drawScene(d),b=d.context.getImageData(Math.round(a.x),Math.round(a.y),1,1).data,b[3]>0},destroy:function(){Kinetic.Node.prototype.destroy.call(this),delete Kinetic.shapes[this.colorKey]},_useBufferCanvas:function(){return(this.hasShadow()||1!==this.getAbsoluteOpacity())&&this.hasFill()&&this.hasStroke()&&this.getStage()},drawScene:function(a,b){var c,d,e,f=this.getLayer(),g=a||f.getCanvas(),h=g.getContext(),i=this._cache.canvas,j=this.sceneFunc(),k=this.hasShadow();if(this.isVisible())if(i)this._drawCachedSceneCanvas(h);else if(j){if(h.save(),this._useBufferCanvas()){if(c=this.getStage(),d=c.bufferCanvas,e=d.getContext(),e.clear(),e.save(),e._applyLineJoin(this),f)f._applyTransform(this,e,b);else{var l=this.getAbsoluteTransform(b).getMatrix();h.transform(l[0],l[1],l[2],l[3],l[4],l[5])}j.call(this,e),e.restore(),k&&!g.hitCanvas&&(h.save(),h._applyShadow(this),h.drawImage(d._canvas,0,0),h.restore()),h._applyOpacity(this),h.drawImage(d._canvas,0,0)}else{if(h._applyLineJoin(this),f)f._applyTransform(this,h,b);else{var m=this.getAbsoluteTransform(b).getMatrix();h.transform(m[0],m[1],m[2],m[3],m[4],m[5])}k&&!g.hitCanvas&&(h.save(),h._applyShadow(this),j.call(this,h),h.restore()),h._applyOpacity(this),j.call(this,h)}h.restore()}return this},drawHit:function(a,b){var c=this.getLayer(),d=a||c.hitCanvas,e=d.getContext(),f=this.hitFunc()||this.sceneFunc(),g=this._cache.canvas,h=g&&g.hit;if(this.shouldDrawHit(d))if(c&&c.clearHitCache(),h)this._drawCachedHitCanvas(e);else if(f){if(e.save(),e._applyLineJoin(this),c)c._applyTransform(this,e,b);else{var i=this.getAbsoluteTransform(b).getMatrix();e.transform(i[0],i[1],i[2],i[3],i[4],i[5])}f.call(this,e),e.restore()}return this},drawHitFromCache:function(a){var b,c,d,e,f,g,h,i,j=a||0,k=this._cache.canvas,l=this._getCachedSceneCanvas(),m=l.getContext(),n=k.hit,o=n.getContext(),p=l.getWidth(),q=l.getHeight();o.clear();try{for(b=m.getImageData(0,0,p,q),c=b.data,d=o.getImageData(0,0,p,q),e=d.data,f=c.length,g=Kinetic.Util._hexToRgb(this.colorKey),h=0;f>h;h+=4)i=c[h+3],i>j&&(e[h]=g.r,e[h+1]=g.g,e[h+2]=g.b,e[h+3]=255);o.putImageData(d,0,0)}catch(r){Kinetic.Util.warn("Unable to draw hit graph from cached scene canvas. "+r.message)}return this}}),Kinetic.Util.extend(Kinetic.Shape,Kinetic.Node),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"stroke"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"strokeRed",0,Kinetic.Validators.RGBComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"strokeGreen",0,Kinetic.Validators.RGBComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"strokeBlue",0,Kinetic.Validators.RGBComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"strokeAlpha",1,Kinetic.Validators.alphaComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"strokeWidth",2),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"lineJoin"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"lineCap"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"sceneFunc"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"hitFunc"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"dash"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"shadowColor"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"shadowRed",0,Kinetic.Validators.RGBComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"shadowGreen",0,Kinetic.Validators.RGBComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"shadowBlue",0,Kinetic.Validators.RGBComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"shadowAlpha",1,Kinetic.Validators.alphaComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"shadowBlur"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"shadowOpacity"),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Shape,"shadowOffset",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"shadowOffsetX",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"shadowOffsetY",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillPatternImage"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fill"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillRed",0,Kinetic.Validators.RGBComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillGreen",0,Kinetic.Validators.RGBComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillBlue",0,Kinetic.Validators.RGBComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillAlpha",1,Kinetic.Validators.alphaComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillPatternX",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillPatternY",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillLinearGradientColorStops"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillRadialGradientStartRadius",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillRadialGradientEndRadius",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillRadialGradientColorStops"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillPatternRepeat","repeat"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillEnabled",!0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"strokeEnabled",!0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"shadowEnabled",!0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"dashEnabled",!0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"strokeScaleEnabled",!0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillPriority","color"),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Shape,"fillPatternOffset",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillPatternOffsetX",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillPatternOffsetY",0),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Shape,"fillPatternScale",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillPatternScaleX",1),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillPatternScaleY",1),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Shape,"fillLinearGradientStartPoint",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillLinearGradientStartPointX",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillLinearGradientStartPointY",0),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Shape,"fillLinearGradientEndPoint",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillLinearGradientEndPointX",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillLinearGradientEndPointY",0),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Shape,"fillRadialGradientStartPoint",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillRadialGradientStartPointX",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillRadialGradientStartPointY",0),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Shape,"fillRadialGradientEndPoint",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillRadialGradientEndPointX",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillRadialGradientEndPointY",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillPatternRotation",0),Kinetic.Factory.backCompat(Kinetic.Shape,{dashArray:"dash",getDashArray:"getDash",setDashArray:"getDash",drawFunc:"sceneFunc",getDrawFunc:"getSceneFunc",setDrawFunc:"setSceneFunc",drawHitFunc:"hitFunc",getDrawHitFunc:"getHitFunc",setDrawHitFunc:"setHitFunc"}),Kinetic.Collection.mapMethods(Kinetic.Shape)}(),function(){function a(a,b){a.content.addEventListener(b,function(c){a[L+b](c)},!1)}var b="Stage",c="string",d="px",e="mouseout",f="mouseleave",g="mouseover",h="mouseenter",i="mousemove",j="mousedown",k="mouseup",l="click",m="dblclick",n="touchstart",o="touchend",p="tap",q="dbltap",r="touchmove",s="DOMMouseScroll",t="mousewheel",u="wheel",v="contentMouseout",w="contentMouseover",x="contentMousemove",y="contentMousedown",z="contentMouseup",A="contentClick",B="contentDblclick",C="contentTouchstart",D="contentTouchend",E="contentDbltap",F="contentTouchmove",G="div",H="relative",I="inline-block",J="kineticjs-content",K=" ",L="_",M="container",N="",O=[j,i,k,e,n,r,o,g,s,t,u],P=O.length;Kinetic.Util.addMethods(Kinetic.Stage,{___init:function(a){this.nodeType=b,Kinetic.Container.call(this,a),this._id=Kinetic.idCounter++,this._buildDOM(),this._bindContentEvents(),this._enableNestedTransforms=!1,Kinetic.stages.push(this)},_validateAdd:function(a){"Layer"!==a.getType()&&Kinetic.Util.error("You may only add layers to the stage.")},setContainer:function(a){if(typeof a===c){var b=a;if(a=Kinetic.document.getElementById(a),!a)throw"Can not find container in document with id "+b}return this._setAttr(M,a),this},shouldDrawHit:function(){return!0},draw:function(){return Kinetic.Node.prototype.draw.call(this),this},setHeight:function(a){return Kinetic.Node.prototype.setHeight.call(this,a),this._resizeDOM(),this},setWidth:function(a){return Kinetic.Node.prototype.setWidth.call(this,a),this._resizeDOM(),this},clear:function(){var a,b=this.children,c=b.length;for(a=0;c>a;a++)b[a].clear();return this},clone:function(a){return a||(a={}),a.container=Kinetic.document.createElement(G),Kinetic.Container.prototype.clone.call(this,a)},destroy:function(){var a=this.content;Kinetic.Container.prototype.destroy.call(this),a&&Kinetic.Util._isInDocument(a)&&this.getContainer().removeChild(a);var b=Kinetic.stages.indexOf(this);b>-1&&Kinetic.stages.splice(b,1)},getPointerPosition:function(){return this.pointerPos},getStage:function(){return this},getContent:function(){return this.content},toDataURL:function(a){function b(e){var f=i[e],j=f.toDataURL(),k=new Kinetic.window.Image;k.onload=function(){h.drawImage(k,0,0),e<i.length-1?b(e+1):a.callback(g.toDataURL(c,d))},k.src=j}a=a||{};var c=a.mimeType||null,d=a.quality||null,e=a.x||0,f=a.y||0,g=new Kinetic.SceneCanvas({width:a.width||this.getWidth(),height:a.height||this.getHeight(),pixelRatio:1}),h=g.getContext()._context,i=this.children;(e||f)&&h.translate(-1*e,-1*f),b(0)},toImage:function(a){var b=a.callback;a.callback=function(a){Kinetic.Util._getImage(a,function(a){b(a)})},this.toDataURL(a)},getIntersection:function(a){var b,c,d=this.getChildren(),e=d.length,f=e-1;for(b=f;b>=0;b--)if(c=d[b].getIntersection(a))return c;return null},_resizeDOM:function(){if(this.content){var a,b,c=this.getWidth(),e=this.getHeight(),f=this.getChildren(),g=f.length;for(this.content.style.width=c+d,this.content.style.height=e+d,this.bufferCanvas.setSize(c,e),this.bufferHitCanvas.setSize(c,e),a=0;g>a;a++)b=f[a],b.setSize(c,e),b.draw()}},add:function(a){if(!(arguments.length>1))return Kinetic.Container.prototype.add.call(this,a),a._setCanvasSize(this.width(),this.height()),a.draw(),this.content.appendChild(a.canvas._canvas),this;for(var b=0;b<arguments.length;b++)this.add(arguments[b])},getParent:function(){return null},getLayer:function(){return null},getLayers:function(){return this.getChildren()},_bindContentEvents:function(){for(var b=0;P>b;b++)a(this,O[b])},_mouseover:function(a){Kinetic.UA.mobile||(this._setPointerPosition(a),this._fire(w,{evt:a}))},_mouseout:function(a){if(!Kinetic.UA.mobile){this._setPointerPosition(a);var b=this.targetShape;b&&!Kinetic.isDragging()&&(b._fireAndBubble(e,{evt:a}),b._fireAndBubble(f,{evt:a}),this.targetShape=null),this.pointerPos=void 0,this._fire(v,{evt:a})}},_mousemove:function(a){if(Kinetic.UA.ieMobile)return this._touchmove(a);if(("undefined"==typeof a.webkitMovementX&&"undefined"==typeof a.webkitMovementY||0!==a.webkitMovementY||0!==a.webkitMovementX)&&!Kinetic.UA.mobile){this._setPointerPosition(a);var b,c=Kinetic.DD;Kinetic.isDragging()||(b=this.getIntersection(this.getPointerPosition()),b&&b.isListening()?Kinetic.isDragging()||this.targetShape&&this.targetShape._id===b._id?b._fireAndBubble(i,{evt:a}):(this.targetShape&&(this.targetShape._fireAndBubble(e,{evt:a},b),this.targetShape._fireAndBubble(f,{evt:a},b)),b._fireAndBubble(g,{evt:a},this.targetShape),b._fireAndBubble(h,{evt:a},this.targetShape),this.targetShape=b):this.targetShape&&!Kinetic.isDragging()&&(this.targetShape._fireAndBubble(e,{evt:a}),this.targetShape._fireAndBubble(f,{evt:a}),this.targetShape=null),this._fire(x,{evt:a})),c&&c._drag(a),a.preventDefault&&a.preventDefault()}},_mousedown:function(a){if(Kinetic.UA.ieMobile)return this._touchstart(a);if(!Kinetic.UA.mobile){this._setPointerPosition(a);var b=this.getIntersection(this.getPointerPosition());Kinetic.listenClickTap=!0,b&&b.isListening()&&(this.clickStartShape=b,b._fireAndBubble(j,{evt:a})),this._fire(y,{evt:a})}a.preventDefault&&a.preventDefault()},_mouseup:function(a){if(Kinetic.UA.ieMobile)return this._touchend(a);if(!Kinetic.UA.mobile){this._setPointerPosition(a);var b=this.getIntersection(this.getPointerPosition()),c=this.clickStartShape,d=!1,e=Kinetic.DD;Kinetic.inDblClickWindow?(d=!0,Kinetic.inDblClickWindow=!1):e&&e.justDragged?e&&(e.justDragged=!1):Kinetic.inDblClickWindow=!0,setTimeout(function(){Kinetic.inDblClickWindow=!1},Kinetic.dblClickWindow),b&&b.isListening()&&(b._fireAndBubble(k,{evt:a}),Kinetic.listenClickTap&&c&&c._id===b._id&&(b._fireAndBubble(l,{evt:a}),d&&b._fireAndBubble(m,{evt:a}))),this._fire(z,{evt:a}),Kinetic.listenClickTap&&(this._fire(A,{evt:a}),d&&this._fire(B,{evt:a})),Kinetic.listenClickTap=!1}a.preventDefault&&a.preventDefault()},_touchstart:function(a){this._setPointerPosition(a);var b=this.getIntersection(this.getPointerPosition());Kinetic.listenClickTap=!0,b&&b.isListening()&&(this.tapStartShape=b,b._fireAndBubble(n,{evt:a}),b.isListening()&&a.preventDefault&&a.preventDefault()),this._fire(C,{evt:a})},_touchend:function(a){this._setPointerPosition(a);var b=this.getIntersection(this.getPointerPosition()),c=!1;Kinetic.inDblClickWindow?(c=!0,Kinetic.inDblClickWindow=!1):Kinetic.inDblClickWindow=!0,setTimeout(function(){Kinetic.inDblClickWindow=!1},Kinetic.dblClickWindow),b&&b.isListening()&&(b._fireAndBubble(o,{evt:a}),Kinetic.listenClickTap&&b._id===this.tapStartShape._id&&(b._fireAndBubble(p,{evt:a}),c&&b._fireAndBubble(q,{evt:a})),b.isListening()&&a.preventDefault&&a.preventDefault()),Kinetic.listenClickTap&&(this._fire(D,{evt:a}),c&&this._fire(E,{evt:a})),Kinetic.listenClickTap=!1},_touchmove:function(a){this._setPointerPosition(a);var b,c=Kinetic.DD;Kinetic.isDragging()||(b=this.getIntersection(this.getPointerPosition()),b&&b.isListening()&&(b._fireAndBubble(r,{evt:a}),b.isListening()&&a.preventDefault&&a.preventDefault()),this._fire(F,{evt:a})),c&&(c._drag(a),Kinetic.isDragging()&&a.preventDefault())},_DOMMouseScroll:function(a){this._mousewheel(a)},_mousewheel:function(a){this._setPointerPosition(a);var b=this.getIntersection(this.getPointerPosition());b&&b.isListening()&&b._fireAndBubble(t,{evt:a})},_wheel:function(a){this._mousewheel(a)},_setPointerPosition:function(a){var b,c=this._getContentPosition(),d=a.offsetX,e=a.clientX,f=null,g=null;a=a?a:window.event,void 0!==a.touches?a.touches.length>0&&(b=a.touches[0],f=b.clientX-c.left,g=b.clientY-c.top):void 0!==d?(f=d,g=a.offsetY):"mozilla"===Kinetic.UA.browser?(f=a.layerX,g=a.layerY):void 0!==e&&c&&(f=e-c.left,g=a.clientY-c.top),null!==f&&null!==g&&(this.pointerPos={x:f,y:g})},_getContentPosition:function(){var a=this.content.getBoundingClientRect?this.content.getBoundingClientRect():{top:0,left:0};return{top:a.top,left:a.left}},_buildDOM:function(){var a=this.getContainer();if(!a){if(Kinetic.Util.isBrowser())throw"Stage has no container. A container is required.";a=Kinetic.document.createElement(G)}a.innerHTML=N,this.content=Kinetic.document.createElement(G),this.content.style.position=H,this.content.style.display=I,this.content.className=J,this.content.setAttribute("role","presentation"),a.appendChild(this.content),this.bufferCanvas=new Kinetic.SceneCanvas({pixelRatio:1}),this.bufferHitCanvas=new Kinetic.HitCanvas,this._resizeDOM()},_onContent:function(a,b){var c,d,e=a.split(K),f=e.length;for(c=0;f>c;c++)d=e[c],this.content.addEventListener(d,b,!1)},cache:function(){Kinetic.Util.warn("Cache function is not allowed for stage. You may use cache only for layers, groups and shapes.")},clearCache:function(){}}),Kinetic.Util.extend(Kinetic.Stage,Kinetic.Container),Kinetic.Factory.addGetter(Kinetic.Stage,"container"),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Stage,"container")}(),function(){Kinetic.Util.addMethods(Kinetic.BaseLayer,{___init:function(a){this.nodeType="Layer",Kinetic.Container.call(this,a)},createPNGStream:function(){return this.canvas._canvas.createPNGStream()},getCanvas:function(){return this.canvas},getHitCanvas:function(){return this.hitCanvas},getContext:function(){return this.getCanvas().getContext()},clear:function(a){return this.getContext().clear(a),this.getHitCanvas().getContext().clear(a),this},clearHitCache:function(){this._hitImageData=void 0},setZIndex:function(a){Kinetic.Node.prototype.setZIndex.call(this,a);var b=this.getStage();return b&&(b.content.removeChild(this.getCanvas()._canvas),a<b.getChildren().length-1?b.content.insertBefore(this.getCanvas()._canvas,b.getChildren()[a+1].getCanvas()._canvas):b.content.appendChild(this.getCanvas()._canvas)),this},moveToTop:function(){Kinetic.Node.prototype.moveToTop.call(this);var a=this.getStage();a&&(a.content.removeChild(this.getCanvas()._canvas),a.content.appendChild(this.getCanvas()._canvas))},moveUp:function(){if(Kinetic.Node.prototype.moveUp.call(this)){var a=this.getStage();a&&(a.content.removeChild(this.getCanvas()._canvas),this.index<a.getChildren().length-1?a.content.insertBefore(this.getCanvas()._canvas,a.getChildren()[this.index+1].getCanvas()._canvas):a.content.appendChild(this.getCanvas()._canvas))}},moveDown:function(){if(Kinetic.Node.prototype.moveDown.call(this)){var a=this.getStage();if(a){var b=a.getChildren();a.content.removeChild(this.getCanvas()._canvas),a.content.insertBefore(this.getCanvas()._canvas,b[this.index+1].getCanvas()._canvas)}}},moveToBottom:function(){if(Kinetic.Node.prototype.moveToBottom.call(this)){var a=this.getStage();if(a){var b=a.getChildren();a.content.removeChild(this.getCanvas()._canvas),a.content.insertBefore(this.getCanvas()._canvas,b[1].getCanvas()._canvas)}}},getLayer:function(){return this},remove:function(){var a=this.getCanvas()._canvas;return Kinetic.Node.prototype.remove.call(this),a&&a.parentNode&&Kinetic.Util._isInDocument(a)&&a.parentNode.removeChild(a),this},getStage:function(){return this.parent},setSize:function(a,b){this.canvas.setSize(a,b)},getWidth:function(){return this.parent?this.parent.getWidth():void 0},setWidth:function(){Kinetic.Util.warn('Can not change width of layer. Use "stage.width(value)" function instead.')},getHeight:function(){return this.parent?this.parent.getHeight():void 0},setHeight:function(){Kinetic.Util.warn('Can not change height of layer. Use "stage.height(value)" function instead.')}}),Kinetic.Util.extend(Kinetic.BaseLayer,Kinetic.Container),Kinetic.Factory.addGetterSetter(Kinetic.BaseLayer,"clearBeforeDraw",!0),Kinetic.Collection.mapMethods(Kinetic.BaseLayer)}(),function(){var a="#",b="beforeDraw",c="draw",d=[{x:0,y:0},{x:-1,y:0},{x:-1,y:-1},{x:0,y:-1},{x:1,y:-1},{x:1,y:0},{x:1,y:1},{x:0,y:1},{x:-1,y:1}],e=d.length;Kinetic.Util.addMethods(Kinetic.Layer,{____init:function(a){this.nodeType="Layer",this.canvas=new Kinetic.SceneCanvas,this.hitCanvas=new Kinetic.HitCanvas,Kinetic.BaseLayer.call(this,a)},_setCanvasSize:function(a,b){this.canvas.setSize(a,b),this.hitCanvas.setSize(a,b)},_validateAdd:function(a){var b=a.getType();"Group"!==b&&"Shape"!==b&&Kinetic.Util.error("You may only add groups and shapes to a layer.")},getIntersection:function(a){var b,c,f,g;if(!this.hitGraphEnabled()||!this.isVisible())return null;for(var h=1,i=!1;;){for(c=0;e>c;c++){if(f=d[c],b=this._getIntersection({x:a.x+f.x*h,y:a.y+f.y*h}),g=b.shape)return g;b.antialiased&&(i=!0)}if(!i)return;h+=1}},_getImageData:function(a,b){var c=this.hitCanvas.width||1,d=this.hitCanvas.height||1,e=Math.round(b)*c+Math.round(a);return this._hitImageData||(this._hitImageData=this.hitCanvas.context.getImageData(0,0,c,d)),[this._hitImageData.data[4*e+0],this._hitImageData.data[4*e+1],this._hitImageData.data[4*e+2],this._hitImageData.data[4*e+3]]},_getIntersection:function(b){var c,d,e=this.hitCanvas.context.getImageData(b.x,b.y,1,1).data,f=e[3];return 255===f?(c=Kinetic.Util._rgbToHex(e[0],e[1],e[2]),d=Kinetic.shapes[a+c],{shape:d}):f>0?{antialiased:!0}:{}},drawScene:function(a,d){var e=this.getLayer(),f=a||e&&e.getCanvas();return this._fire(b,{node:this}),this.getClearBeforeDraw()&&f.getContext().clear(),Kinetic.Container.prototype.drawScene.call(this,f,d),this._fire(c,{node:this}),this},_applyTransform:function(a,b,c){var d=a.getAbsoluteTransform(c).getMatrix();b.transform(d[0],d[1],d[2],d[3],d[4],d[5])},drawHit:function(a,b){var c=this.getLayer(),d=a||c&&c.hitCanvas;return c&&c.getClearBeforeDraw()&&c.getHitCanvas().getContext().clear(),Kinetic.Container.prototype.drawHit.call(this,d,b),this.imageData=null,this},clear:function(a){return this.getContext().clear(a),this.getHitCanvas().getContext().clear(a),this.imageData=null,this},setVisible:function(a){return Kinetic.Node.prototype.setVisible.call(this,a),a?(this.getCanvas()._canvas.style.display="block",this.hitCanvas._canvas.style.display="block"):(this.getCanvas()._canvas.style.display="none",this.hitCanvas._canvas.style.display="none"),this},enableHitGraph:function(){return this.setHitGraphEnabled(!0),this},disableHitGraph:function(){return this.setHitGraphEnabled(!1),this},setSize:function(a,b){Kinetic.BaseLayer.prototype.setSize.call(this,a,b),this.hitCanvas.setSize(a,b)}}),Kinetic.Util.extend(Kinetic.Layer,Kinetic.BaseLayer),Kinetic.Factory.addGetterSetter(Kinetic.Layer,"hitGraphEnabled",!0),Kinetic.Collection.mapMethods(Kinetic.Layer)}(),function(){Kinetic.Util.addMethods(Kinetic.FastLayer,{____init:function(a){this.nodeType="Layer",this.canvas=new Kinetic.SceneCanvas,Kinetic.BaseLayer.call(this,a)},_validateAdd:function(a){var b=a.getType();"Shape"!==b&&Kinetic.Util.error("You may only add shapes to a fast layer.")},_setCanvasSize:function(a,b){this.canvas.setSize(a,b)},hitGraphEnabled:function(){return!1},getIntersection:function(){return null},drawScene:function(a){var b=this.getLayer(),c=a||b&&b.getCanvas();return this.getClearBeforeDraw()&&c.getContext().clear(),Kinetic.Container.prototype.drawScene.call(this,c),this},_applyTransform:function(a,b,c){if(!c||c._id!==this._id){var d=a.getTransform().getMatrix();b.transform(d[0],d[1],d[2],d[3],d[4],d[5])}},draw:function(){return this.drawScene(),this},clear:function(a){return this.getContext().clear(a),this},setVisible:function(a){return Kinetic.Node.prototype.setVisible.call(this,a),this.getCanvas()._canvas.style.display=a?"block":"none",this}}),Kinetic.Util.extend(Kinetic.FastLayer,Kinetic.BaseLayer),Kinetic.Collection.mapMethods(Kinetic.FastLayer)}(),function(){Kinetic.Util.addMethods(Kinetic.Group,{___init:function(a){this.nodeType="Group",Kinetic.Container.call(this,a)},_validateAdd:function(a){var b=a.getType();"Group"!==b&&"Shape"!==b&&Kinetic.Util.error("You may only add groups and shapes to groups.")}}),Kinetic.Util.extend(Kinetic.Group,Kinetic.Container),Kinetic.Collection.mapMethods(Kinetic.Group)}(),function(){Kinetic.Rect=function(a){this.___init(a)},Kinetic.Rect.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className="Rect",this.sceneFunc(this._sceneFunc)},_sceneFunc:function(a){var b=this.getCornerRadius(),c=this.getWidth(),d=this.getHeight();a.beginPath(),b?(a.moveTo(b,0),a.lineTo(c-b,0),a.arc(c-b,b,b,3*Math.PI/2,0,!1),a.lineTo(c,d-b),a.arc(c-b,d-b,b,0,Math.PI/2,!1),a.lineTo(b,d),a.arc(b,d-b,b,Math.PI/2,Math.PI,!1),a.lineTo(0,b),a.arc(b,b,b,Math.PI,3*Math.PI/2,!1)):a.rect(0,0,c,d),a.closePath(),a.fillStrokeShape(this)}},Kinetic.Util.extend(Kinetic.Rect,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.Rect,"cornerRadius",0),Kinetic.Collection.mapMethods(Kinetic.Rect)}(),function(){var a=2*Math.PI-1e-4,b="Circle";Kinetic.Circle=function(a){this.___init(a)},Kinetic.Circle.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className=b,this.sceneFunc(this._sceneFunc)},_sceneFunc:function(b){b.beginPath(),b.arc(0,0,this.getRadius(),0,a,!1),b.closePath(),b.fillStrokeShape(this)},getWidth:function(){return 2*this.getRadius()},getHeight:function(){return 2*this.getRadius()},setWidth:function(a){Kinetic.Node.prototype.setWidth.call(this,a),this.radius()!==a/2&&this.setRadius(a/2)},setHeight:function(a){Kinetic.Node.prototype.setHeight.call(this,a),this.radius()!==a/2&&this.setRadius(a/2)},setRadius:function(a){this._setAttr("radius",a),this.setWidth(2*a),this.setHeight(2*a)}},Kinetic.Util.extend(Kinetic.Circle,Kinetic.Shape),Kinetic.Factory.addGetter(Kinetic.Circle,"radius",0),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Circle,"radius"),Kinetic.Collection.mapMethods(Kinetic.Circle)}(),function(){var a=2*Math.PI-1e-4,b="Ellipse";Kinetic.Ellipse=function(a){this.___init(a)},Kinetic.Ellipse.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className=b,this.sceneFunc(this._sceneFunc)},_sceneFunc:function(b){var c=this.getRadiusX(),d=this.getRadiusY();b.beginPath(),b.save(),c!==d&&b.scale(1,d/c),b.arc(0,0,c,0,a,!1),b.restore(),b.closePath(),b.fillStrokeShape(this)},getWidth:function(){return 2*this.getRadiusX()},getHeight:function(){return 2*this.getRadiusY()},setWidth:function(a){Kinetic.Node.prototype.setWidth.call(this,a),this.setRadius({x:a/2})},setHeight:function(a){Kinetic.Node.prototype.setHeight.call(this,a),this.setRadius({y:a/2})}},Kinetic.Util.extend(Kinetic.Ellipse,Kinetic.Shape),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Ellipse,"radius",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Ellipse,"radiusX",0),Kinetic.Factory.addGetterSetter(Kinetic.Ellipse,"radiusY",0),Kinetic.Collection.mapMethods(Kinetic.Ellipse)}(),function(){var a=2*Math.PI-1e-4;Kinetic.Ring=function(a){this.___init(a)},Kinetic.Ring.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className="Ring",this.sceneFunc(this._sceneFunc)},_sceneFunc:function(b){b.beginPath(),b.arc(0,0,this.getInnerRadius(),0,a,!1),b.moveTo(this.getOuterRadius(),0),b.arc(0,0,this.getOuterRadius(),a,0,!0),b.closePath(),b.fillStrokeShape(this)},getWidth:function(){return 2*this.getOuterRadius()},getHeight:function(){return 2*this.getOuterRadius()},setWidth:function(a){Kinetic.Node.prototype.setWidth.call(this,a),this.outerRadius()!==a/2&&this.setOuterRadius(a/2)},setHeight:function(a){Kinetic.Node.prototype.setHeight.call(this,a),this.outerRadius()!==a/2&&this.setOuterRadius(a/2)},setOuterRadius:function(a){this._setAttr("outerRadius",a),this.setWidth(2*a),this.setHeight(2*a)}},Kinetic.Util.extend(Kinetic.Ring,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.Ring,"innerRadius",0),Kinetic.Factory.addGetter(Kinetic.Ring,"outerRadius",0),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Ring,"outerRadius"),Kinetic.Collection.mapMethods(Kinetic.Ring)}(),function(){Kinetic.Wedge=function(a){this.___init(a)},Kinetic.Wedge.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className="Wedge",this.sceneFunc(this._sceneFunc)},_sceneFunc:function(a){a.beginPath(),a.arc(0,0,this.getRadius(),0,Kinetic.getAngle(this.getAngle()),this.getClockwise()),a.lineTo(0,0),a.closePath(),a.fillStrokeShape(this)}},Kinetic.Util.extend(Kinetic.Wedge,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.Wedge,"radius",0),Kinetic.Factory.addGetterSetter(Kinetic.Wedge,"angle",0),Kinetic.Factory.addGetterSetter(Kinetic.Wedge,"clockwise",!1),Kinetic.Factory.backCompat(Kinetic.Wedge,{angleDeg:"angle",getAngleDeg:"getAngle",setAngleDeg:"setAngle"}),Kinetic.Collection.mapMethods(Kinetic.Wedge)}(),function(){Kinetic.Arc=function(a){this.___init(a)},Kinetic.Arc.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className="Arc",this.sceneFunc(this._sceneFunc)},_sceneFunc:function(a){var b=Kinetic.getAngle(this.angle()),c=this.clockwise();a.beginPath(),a.arc(0,0,this.getOuterRadius(),0,b,c),a.arc(0,0,this.getInnerRadius(),b,0,!c),a.closePath(),a.fillStrokeShape(this)}},Kinetic.Util.extend(Kinetic.Arc,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.Arc,"innerRadius",0),Kinetic.Factory.addGetterSetter(Kinetic.Arc,"outerRadius",0),Kinetic.Factory.addGetterSetter(Kinetic.Arc,"angle",0),Kinetic.Factory.addGetterSetter(Kinetic.Arc,"clockwise",!1),Kinetic.Collection.mapMethods(Kinetic.Arc)}(),function(){var a="Image";Kinetic.Image=function(a){this.___init(a)},Kinetic.Image.prototype={___init:function(b){Kinetic.Shape.call(this,b),this.className=a,this.sceneFunc(this._sceneFunc),this.hitFunc(this._hitFunc)},_useBufferCanvas:function(){return(this.hasShadow()||1!==this.getAbsoluteOpacity())&&this.hasStroke()&&this.getStage()},_sceneFunc:function(a){var b,c,d,e=this.getWidth(),f=this.getHeight(),g=this.getImage();g&&(b=this.getCropWidth(),c=this.getCropHeight(),d=b&&c?[g,this.getCropX(),this.getCropY(),b,c,0,0,e,f]:[g,0,0,e,f]),(this.hasFill()||this.hasStroke()||this.hasShadow())&&(a.beginPath(),a.rect(0,0,e,f),a.closePath(),a.fillStrokeShape(this)),g&&a.drawImage.apply(a,d)
},_hitFunc:function(a){var b=this.getWidth(),c=this.getHeight();a.beginPath(),a.rect(0,0,b,c),a.closePath(),a.fillStrokeShape(this)},getWidth:function(){var a=this.getImage();return this.attrs.width||(a?a.width:0)},getHeight:function(){var a=this.getImage();return this.attrs.height||(a?a.height:0)}},Kinetic.Util.extend(Kinetic.Image,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.Image,"image"),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Image,"crop",["x","y","width","height"]),Kinetic.Factory.addGetterSetter(Kinetic.Image,"cropX",0),Kinetic.Factory.addGetterSetter(Kinetic.Image,"cropY",0),Kinetic.Factory.addGetterSetter(Kinetic.Image,"cropWidth",0),Kinetic.Factory.addGetterSetter(Kinetic.Image,"cropHeight",0),Kinetic.Collection.mapMethods(Kinetic.Image)}(),function(){function a(a){a.fillText(this.partialText,0,0)}function b(a){a.strokeText(this.partialText,0,0)}var c="auto",d="center",e="Change.kinetic",f="2d",g="-",h="",i="left",j="text",k="Text",l="middle",m="normal",n="px ",o=" ",p="right",q="word",r="char",s="none",t=["fontFamily","fontSize","fontStyle","fontVariant","padding","align","lineHeight","text","width","height","wrap"],u=t.length,v=Kinetic.Util.createCanvasElement().getContext(f);Kinetic.Text=function(a){this.___init(a)},Kinetic.Text.prototype={___init:function(d){d=d||{},d.fill=d.fill||"black",void 0===d.width&&(d.width=c),void 0===d.height&&(d.height=c),Kinetic.Shape.call(this,d),this._fillFunc=a,this._strokeFunc=b,this.className=k;for(var f=0;u>f;f++)this.on(t[f]+e,this._setTextData);this._setTextData(),this.sceneFunc(this._sceneFunc),this.hitFunc(this._hitFunc)},_sceneFunc:function(a){var b,c=this.getPadding(),e=this.getTextHeight(),f=this.getLineHeight()*e,g=this.textArr,h=g.length,j=this.getWidth();for(a.setAttr("font",this._getContextFont()),a.setAttr("textBaseline",l),a.setAttr("textAlign",i),a.save(),a.translate(c,0),a.translate(0,c+e/2),b=0;h>b;b++){var k=g[b],m=k.text,n=k.width;a.save(),this.getAlign()===p?a.translate(j-n-2*c,0):this.getAlign()===d&&a.translate((j-n-2*c)/2,0),this.partialText=m,a.fillStrokeShape(this),a.restore(),a.translate(0,f)}a.restore()},_hitFunc:function(a){var b=this.getWidth(),c=this.getHeight();a.beginPath(),a.rect(0,0,b,c),a.closePath(),a.fillStrokeShape(this)},setText:function(a){var b=Kinetic.Util._isString(a)?a:a.toString();return this._setAttr(j,b),this},getWidth:function(){return this.attrs.width===c?this.getTextWidth()+2*this.getPadding():this.attrs.width},getHeight:function(){return this.attrs.height===c?this.getTextHeight()*this.textArr.length*this.getLineHeight()+2*this.getPadding():this.attrs.height},getTextWidth:function(){return this.textWidth},getTextHeight:function(){return this.textHeight},_getTextSize:function(a){var b,c=v,d=this.getFontSize();return c.save(),c.font=this._getContextFont(),b=c.measureText(a),c.restore(),{width:b.width,height:parseInt(d,10)}},_getContextFont:function(){return this.getFontStyle()+o+this.getFontVariant()+o+this.getFontSize()+n+this.getFontFamily()},_addTextLine:function(a,b){return this.textArr.push({text:a,width:b})},_getTextWidth:function(a){return v.measureText(a).width},_setTextData:function(){var a=this.getText().split("\n"),b=+this.getFontSize(),d=0,e=this.getLineHeight()*b,f=this.attrs.width,h=this.attrs.height,i=f!==c,j=h!==c,k=this.getPadding(),l=f-2*k,m=h-2*k,n=0,p=this.getWrap(),q=p!==s,t=p!==r&&q;this.textArr=[],v.save(),v.font=this._getContextFont();for(var u=0,w=a.length;w>u;++u){var x=a[u],y=this._getTextWidth(x);if(i&&y>l)for(;x.length>0;){for(var z=0,A=x.length,B="",C=0;A>z;){var D=z+A>>>1,E=x.slice(0,D+1),F=this._getTextWidth(E);l>=F?(z=D+1,B=E,C=F):A=D}if(!B)break;if(t){var G=Math.max(B.lastIndexOf(o),B.lastIndexOf(g))+1;G>0&&(z=G,B=B.slice(0,z),C=this._getTextWidth(B))}if(this._addTextLine(B,C),d=Math.max(d,C),n+=e,!q||j&&n+e>m)break;if(x=x.slice(z),x.length>0&&(y=this._getTextWidth(x),l>=y)){this._addTextLine(x,y),n+=e,d=Math.max(d,y);break}}else this._addTextLine(x,y),n+=e,d=Math.max(d,y);if(j&&n+e>m)break}v.restore(),this.textHeight=b,this.textWidth=d}},Kinetic.Util.extend(Kinetic.Text,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.Text,"fontFamily","Arial"),Kinetic.Factory.addGetterSetter(Kinetic.Text,"fontSize",12),Kinetic.Factory.addGetterSetter(Kinetic.Text,"fontStyle",m),Kinetic.Factory.addGetterSetter(Kinetic.Text,"fontVariant",m),Kinetic.Factory.addGetterSetter(Kinetic.Text,"padding",0),Kinetic.Factory.addGetterSetter(Kinetic.Text,"align",i),Kinetic.Factory.addGetterSetter(Kinetic.Text,"lineHeight",1),Kinetic.Factory.addGetterSetter(Kinetic.Text,"wrap",q),Kinetic.Factory.addGetter(Kinetic.Text,"text",h),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Text,"text"),Kinetic.Collection.mapMethods(Kinetic.Text)}(),function(){Kinetic.Line=function(a){this.___init(a)},Kinetic.Line.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className="Line",this.on("pointsChange.kinetic tensionChange.kinetic closedChange.kinetic",function(){this._clearCache("tensionPoints")}),this.sceneFunc(this._sceneFunc)},_sceneFunc:function(a){var b,c,d,e=this.getPoints(),f=e.length,g=this.getTension(),h=this.getClosed();if(f){if(a.beginPath(),a.moveTo(e[0],e[1]),0!==g&&f>4){for(b=this.getTensionPoints(),c=b.length,d=h?0:4,h||a.quadraticCurveTo(b[0],b[1],b[2],b[3]);c-2>d;)a.bezierCurveTo(b[d++],b[d++],b[d++],b[d++],b[d++],b[d++]);h||a.quadraticCurveTo(b[c-2],b[c-1],e[f-2],e[f-1])}else for(d=2;f>d;d+=2)a.lineTo(e[d],e[d+1]);h?(a.closePath(),a.fillStrokeShape(this)):a.strokeShape(this)}},getTensionPoints:function(){return this._getCache("tensionPoints",this._getTensionPoints)},_getTensionPoints:function(){return this.getClosed()?this._getTensionPointsClosed():Kinetic.Util._expandPoints(this.getPoints(),this.getTension())},_getTensionPointsClosed:function(){var a=this.getPoints(),b=a.length,c=this.getTension(),d=Kinetic.Util,e=d._getControlPoints(a[b-2],a[b-1],a[0],a[1],a[2],a[3],c),f=d._getControlPoints(a[b-4],a[b-3],a[b-2],a[b-1],a[0],a[1],c),g=Kinetic.Util._expandPoints(a,c),h=[e[2],e[3]].concat(g).concat([f[0],f[1],a[b-2],a[b-1],f[2],f[3],e[0],e[1],a[0],a[1]]);return h}},Kinetic.Util.extend(Kinetic.Line,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.Line,"closed",!1),Kinetic.Factory.addGetterSetter(Kinetic.Line,"tension",0),Kinetic.Factory.addGetterSetter(Kinetic.Line,"points",[]),Kinetic.Collection.mapMethods(Kinetic.Line)}(),function(){Kinetic.Sprite=function(a){this.___init(a)},Kinetic.Sprite.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className="Sprite",this._updated=!0;var b=this;this.anim=new Kinetic.Animation(function(){var a=b._updated;return b._updated=!1,a}),this.on("animationChange.kinetic",function(){this.frameIndex(0)}),this.on("frameIndexChange.kinetic",function(){this._updated=!0}),this.on("frameRateChange.kinetic",function(){this.anim.isRunning()&&(clearInterval(this.interval),this._setInterval())}),this.sceneFunc(this._sceneFunc),this.hitFunc(this._hitFunc)},_sceneFunc:function(a){var b=this.getAnimation(),c=this.frameIndex(),d=4*c,e=this.getAnimations()[b],f=this.frameOffsets(),g=e[d+0],h=e[d+1],i=e[d+2],j=e[d+3],k=this.getImage();if(k)if(f){var l=f[b],m=2*c;a.drawImage(k,g,h,i,j,l[m+0],l[m+1],i,j)}else a.drawImage(k,g,h,i,j,0,0,i,j)},_hitFunc:function(a){var b=this.getAnimation(),c=this.frameIndex(),d=4*c,e=this.getAnimations()[b],f=this.frameOffsets(),g=e[d+2],h=e[d+3];if(a.beginPath(),f){var i=f[b],j=2*c;a.rect(i[j+0],i[j+1],g,h)}else a.rect(0,0,g,h);a.closePath(),a.fillShape(this)},_useBufferCanvas:function(){return(this.hasShadow()||1!==this.getAbsoluteOpacity())&&this.hasStroke()},_setInterval:function(){var a=this;this.interval=setInterval(function(){a._updateIndex()},1e3/this.getFrameRate())},start:function(){var a=this.getLayer();this.anim.setLayers(a),this._setInterval(),this.anim.start()},stop:function(){this.anim.stop(),clearInterval(this.interval)},isRunning:function(){return this.anim.isRunning()},_updateIndex:function(){var a=this.frameIndex(),b=this.getAnimation(),c=this.getAnimations(),d=c[b],e=d.length/4;this.frameIndex(e-1>a?a+1:0)}},Kinetic.Util.extend(Kinetic.Sprite,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.Sprite,"animation"),Kinetic.Factory.addGetterSetter(Kinetic.Sprite,"animations"),Kinetic.Factory.addGetterSetter(Kinetic.Sprite,"frameOffsets"),Kinetic.Factory.addGetterSetter(Kinetic.Sprite,"image"),Kinetic.Factory.addGetterSetter(Kinetic.Sprite,"frameIndex",0),Kinetic.Factory.addGetterSetter(Kinetic.Sprite,"frameRate",17),Kinetic.Factory.backCompat(Kinetic.Sprite,{index:"frameIndex",getIndex:"getFrameIndex",setIndex:"setFrameIndex"}),Kinetic.Collection.mapMethods(Kinetic.Sprite)}(),function(){Kinetic.Path=function(a){this.___init(a)},Kinetic.Path.prototype={___init:function(a){this.dataArray=[];var b=this;Kinetic.Shape.call(this,a),this.className="Path",this.dataArray=Kinetic.Path.parsePathData(this.getData()),this.on("dataChange.kinetic",function(){b.dataArray=Kinetic.Path.parsePathData(this.getData())}),this.sceneFunc(this._sceneFunc)},_sceneFunc:function(a){var b=this.dataArray,c=!1;a.beginPath();for(var d=0;d<b.length;d++){var e=b[d].command,f=b[d].points;switch(e){case"L":a.lineTo(f[0],f[1]);break;case"M":a.moveTo(f[0],f[1]);break;case"C":a.bezierCurveTo(f[0],f[1],f[2],f[3],f[4],f[5]);break;case"Q":a.quadraticCurveTo(f[0],f[1],f[2],f[3]);break;case"A":var g=f[0],h=f[1],i=f[2],j=f[3],k=f[4],l=f[5],m=f[6],n=f[7],o=i>j?i:j,p=i>j?1:i/j,q=i>j?j/i:1;a.translate(g,h),a.rotate(m),a.scale(p,q),a.arc(0,0,o,k,k+l,1-n),a.scale(1/p,1/q),a.rotate(-m),a.translate(-g,-h);break;case"z":a.closePath(),c=!0}}c?a.fillStrokeShape(this):a.strokeShape(this)}},Kinetic.Util.extend(Kinetic.Path,Kinetic.Shape),Kinetic.Path.getLineLength=function(a,b,c,d){return Math.sqrt((c-a)*(c-a)+(d-b)*(d-b))},Kinetic.Path.getPointOnLine=function(a,b,c,d,e,f,g){void 0===f&&(f=b),void 0===g&&(g=c);var h=(e-c)/(d-b+1e-8),i=Math.sqrt(a*a/(1+h*h));b>d&&(i*=-1);var j,k=h*i;if(d===b)j={x:f,y:g+k};else if((g-c)/(f-b+1e-8)===h)j={x:f+i,y:g+k};else{var l,m,n=this.getLineLength(b,c,d,e);if(1e-8>n)return void 0;var o=(f-b)*(d-b)+(g-c)*(e-c);o/=n*n,l=b+o*(d-b),m=c+o*(e-c);var p=this.getLineLength(f,g,l,m),q=Math.sqrt(a*a-p*p);i=Math.sqrt(q*q/(1+h*h)),b>d&&(i*=-1),k=h*i,j={x:l+i,y:m+k}}return j},Kinetic.Path.getPointOnCubicBezier=function(a,b,c,d,e,f,g,h,i){function j(a){return a*a*a}function k(a){return 3*a*a*(1-a)}function l(a){return 3*a*(1-a)*(1-a)}function m(a){return(1-a)*(1-a)*(1-a)}var n=h*j(a)+f*k(a)+d*l(a)+b*m(a),o=i*j(a)+g*k(a)+e*l(a)+c*m(a);return{x:n,y:o}},Kinetic.Path.getPointOnQuadraticBezier=function(a,b,c,d,e,f,g){function h(a){return a*a}function i(a){return 2*a*(1-a)}function j(a){return(1-a)*(1-a)}var k=f*h(a)+d*i(a)+b*j(a),l=g*h(a)+e*i(a)+c*j(a);return{x:k,y:l}},Kinetic.Path.getPointOnEllipticalArc=function(a,b,c,d,e,f){var g=Math.cos(f),h=Math.sin(f),i={x:c*Math.cos(e),y:d*Math.sin(e)};return{x:a+(i.x*g-i.y*h),y:b+(i.x*h+i.y*g)}},Kinetic.Path.parsePathData=function(a){if(!a)return[];var b=a,c=["m","M","l","L","v","V","h","H","z","Z","c","C","q","Q","t","T","s","S","a","A"];b=b.replace(new RegExp(" ","g"),",");for(var d=0;d<c.length;d++)b=b.replace(new RegExp(c[d],"g"),"|"+c[d]);var e=b.split("|"),f=[],g=0,h=0;for(d=1;d<e.length;d++){var i=e[d],j=i.charAt(0);i=i.slice(1),i=i.replace(new RegExp(",-","g"),"-"),i=i.replace(new RegExp("-","g"),",-"),i=i.replace(new RegExp("e,-","g"),"e-");var k=i.split(",");k.length>0&&""===k[0]&&k.shift();for(var l=0;l<k.length;l++)k[l]=parseFloat(k[l]);for(;k.length>0&&!isNaN(k[0]);){var m,n,o,p,q,r,s,t,u,v,w=null,x=[],y=g,z=h;switch(j){case"l":g+=k.shift(),h+=k.shift(),w="L",x.push(g,h);break;case"L":g=k.shift(),h=k.shift(),x.push(g,h);break;case"m":var A=k.shift(),B=k.shift();if(g+=A,h+=B,w="M",f.length>2&&"z"===f[f.length-1].command)for(var C=f.length-2;C>=0;C--)if("M"===f[C].command){g=f[C].points[0]+A,h=f[C].points[1]+B;break}x.push(g,h),j="l";break;case"M":g=k.shift(),h=k.shift(),w="M",x.push(g,h),j="L";break;case"h":g+=k.shift(),w="L",x.push(g,h);break;case"H":g=k.shift(),w="L",x.push(g,h);break;case"v":h+=k.shift(),w="L",x.push(g,h);break;case"V":h=k.shift(),w="L",x.push(g,h);break;case"C":x.push(k.shift(),k.shift(),k.shift(),k.shift()),g=k.shift(),h=k.shift(),x.push(g,h);break;case"c":x.push(g+k.shift(),h+k.shift(),g+k.shift(),h+k.shift()),g+=k.shift(),h+=k.shift(),w="C",x.push(g,h);break;case"S":n=g,o=h,m=f[f.length-1],"C"===m.command&&(n=g+(g-m.points[2]),o=h+(h-m.points[3])),x.push(n,o,k.shift(),k.shift()),g=k.shift(),h=k.shift(),w="C",x.push(g,h);break;case"s":n=g,o=h,m=f[f.length-1],"C"===m.command&&(n=g+(g-m.points[2]),o=h+(h-m.points[3])),x.push(n,o,g+k.shift(),h+k.shift()),g+=k.shift(),h+=k.shift(),w="C",x.push(g,h);break;case"Q":x.push(k.shift(),k.shift()),g=k.shift(),h=k.shift(),x.push(g,h);break;case"q":x.push(g+k.shift(),h+k.shift()),g+=k.shift(),h+=k.shift(),w="Q",x.push(g,h);break;case"T":n=g,o=h,m=f[f.length-1],"Q"===m.command&&(n=g+(g-m.points[0]),o=h+(h-m.points[1])),g=k.shift(),h=k.shift(),w="Q",x.push(n,o,g,h);break;case"t":n=g,o=h,m=f[f.length-1],"Q"===m.command&&(n=g+(g-m.points[0]),o=h+(h-m.points[1])),g+=k.shift(),h+=k.shift(),w="Q",x.push(n,o,g,h);break;case"A":p=k.shift(),q=k.shift(),r=k.shift(),s=k.shift(),t=k.shift(),u=g,v=h,g=k.shift(),h=k.shift(),w="A",x=this.convertEndpointToCenterParameterization(u,v,g,h,s,t,p,q,r);break;case"a":p=k.shift(),q=k.shift(),r=k.shift(),s=k.shift(),t=k.shift(),u=g,v=h,g+=k.shift(),h+=k.shift(),w="A",x=this.convertEndpointToCenterParameterization(u,v,g,h,s,t,p,q,r)}f.push({command:w||j,points:x,start:{x:y,y:z},pathLength:this.calcLength(y,z,w||j,x)})}("z"===j||"Z"===j)&&f.push({command:"z",points:[],start:void 0,pathLength:0})}return f},Kinetic.Path.calcLength=function(a,b,c,d){var e,f,g,h,i=Kinetic.Path;switch(c){case"L":return i.getLineLength(a,b,d[0],d[1]);case"C":for(e=0,f=i.getPointOnCubicBezier(0,a,b,d[0],d[1],d[2],d[3],d[4],d[5]),h=.01;1>=h;h+=.01)g=i.getPointOnCubicBezier(h,a,b,d[0],d[1],d[2],d[3],d[4],d[5]),e+=i.getLineLength(f.x,f.y,g.x,g.y),f=g;return e;case"Q":for(e=0,f=i.getPointOnQuadraticBezier(0,a,b,d[0],d[1],d[2],d[3]),h=.01;1>=h;h+=.01)g=i.getPointOnQuadraticBezier(h,a,b,d[0],d[1],d[2],d[3]),e+=i.getLineLength(f.x,f.y,g.x,g.y),f=g;return e;case"A":e=0;var j=d[4],k=d[5],l=d[4]+k,m=Math.PI/180;if(Math.abs(j-l)<m&&(m=Math.abs(j-l)),f=i.getPointOnEllipticalArc(d[0],d[1],d[2],d[3],j,0),0>k)for(h=j-m;h>l;h-=m)g=i.getPointOnEllipticalArc(d[0],d[1],d[2],d[3],h,0),e+=i.getLineLength(f.x,f.y,g.x,g.y),f=g;else for(h=j+m;l>h;h+=m)g=i.getPointOnEllipticalArc(d[0],d[1],d[2],d[3],h,0),e+=i.getLineLength(f.x,f.y,g.x,g.y),f=g;return g=i.getPointOnEllipticalArc(d[0],d[1],d[2],d[3],l,0),e+=i.getLineLength(f.x,f.y,g.x,g.y)}return 0},Kinetic.Path.convertEndpointToCenterParameterization=function(a,b,c,d,e,f,g,h,i){var j=i*(Math.PI/180),k=Math.cos(j)*(a-c)/2+Math.sin(j)*(b-d)/2,l=-1*Math.sin(j)*(a-c)/2+Math.cos(j)*(b-d)/2,m=k*k/(g*g)+l*l/(h*h);m>1&&(g*=Math.sqrt(m),h*=Math.sqrt(m));var n=Math.sqrt((g*g*h*h-g*g*l*l-h*h*k*k)/(g*g*l*l+h*h*k*k));e===f&&(n*=-1),isNaN(n)&&(n=0);var o=n*g*l/h,p=n*-h*k/g,q=(a+c)/2+Math.cos(j)*o-Math.sin(j)*p,r=(b+d)/2+Math.sin(j)*o+Math.cos(j)*p,s=function(a){return Math.sqrt(a[0]*a[0]+a[1]*a[1])},t=function(a,b){return(a[0]*b[0]+a[1]*b[1])/(s(a)*s(b))},u=function(a,b){return(a[0]*b[1]<a[1]*b[0]?-1:1)*Math.acos(t(a,b))},v=u([1,0],[(k-o)/g,(l-p)/h]),w=[(k-o)/g,(l-p)/h],x=[(-1*k-o)/g,(-1*l-p)/h],y=u(w,x);return t(w,x)<=-1&&(y=Math.PI),t(w,x)>=1&&(y=0),0===f&&y>0&&(y-=2*Math.PI),1===f&&0>y&&(y+=2*Math.PI),[q,r,g,h,v,y,j,f]},Kinetic.Factory.addGetterSetter(Kinetic.Path,"data"),Kinetic.Collection.mapMethods(Kinetic.Path)}(),function(){function a(a){a.fillText(this.partialText,0,0)}function b(a){a.strokeText(this.partialText,0,0)}var c="",d="normal";Kinetic.TextPath=function(a){this.___init(a)},Kinetic.TextPath.prototype={___init:function(c){var d=this;this.dummyCanvas=Kinetic.Util.createCanvasElement(),this.dataArray=[],Kinetic.Shape.call(this,c),this._fillFunc=a,this._strokeFunc=b,this._fillFuncHit=a,this._strokeFuncHit=b,this.className="TextPath",this.dataArray=Kinetic.Path.parsePathData(this.attrs.data),this.on("dataChange.kinetic",function(){d.dataArray=Kinetic.Path.parsePathData(this.attrs.data)}),this.on("textChange.kinetic textStroke.kinetic textStrokeWidth.kinetic",d._setTextData),d._setTextData(),this.sceneFunc(this._sceneFunc)},_sceneFunc:function(a){a.setAttr("font",this._getContextFont()),a.setAttr("textBaseline","middle"),a.setAttr("textAlign","left"),a.save();for(var b=this.glyphInfo,c=0;c<b.length;c++){a.save();var d=b[c].p0;a.translate(d.x,d.y),a.rotate(b[c].rotation),this.partialText=b[c].text,a.fillStrokeShape(this),a.restore()}a.restore()},getTextWidth:function(){return this.textWidth},getTextHeight:function(){return this.textHeight},setText:function(a){Kinetic.Text.prototype.setText.call(this,a)},_getTextSize:function(a){var b=this.dummyCanvas,c=b.getContext("2d");c.save(),c.font=this._getContextFont();var d=c.measureText(a);return c.restore(),{width:d.width,height:parseInt(this.attrs.fontSize,10)}},_setTextData:function(){var a=this,b=this._getTextSize(this.attrs.text);this.textWidth=b.width,this.textHeight=b.height,this.glyphInfo=[];for(var c,d,e,f=this.attrs.text.split(""),g=-1,h=0,i=function(){h=0;for(var b=a.dataArray,d=g+1;d<b.length;d++){if(b[d].pathLength>0)return g=d,b[d];"M"==b[d].command&&(c={x:b[d].points[0],y:b[d].points[1]})}return{}},j=function(b){var f=a._getTextSize(b).width,g=0,j=0;for(d=void 0;Math.abs(f-g)/f>.01&&25>j;){j++;for(var k=g;void 0===e;)e=i(),e&&k+e.pathLength<f&&(k+=e.pathLength,e=void 0);if(e==={}||void 0===c)return void 0;var l=!1;switch(e.command){case"L":Kinetic.Path.getLineLength(c.x,c.y,e.points[0],e.points[1])>f?d=Kinetic.Path.getPointOnLine(f,c.x,c.y,e.points[0],e.points[1],c.x,c.y):e=void 0;break;case"A":var m=e.points[4],n=e.points[5],o=e.points[4]+n;0===h?h=m+1e-8:f>g?h+=Math.PI/180*n/Math.abs(n):h-=Math.PI/360*n/Math.abs(n),(0>n&&o>h||n>=0&&h>o)&&(h=o,l=!0),d=Kinetic.Path.getPointOnEllipticalArc(e.points[0],e.points[1],e.points[2],e.points[3],h,e.points[6]);break;case"C":0===h?h=f>e.pathLength?1e-8:f/e.pathLength:f>g?h+=(f-g)/e.pathLength:h-=(g-f)/e.pathLength,h>1&&(h=1,l=!0),d=Kinetic.Path.getPointOnCubicBezier(h,e.start.x,e.start.y,e.points[0],e.points[1],e.points[2],e.points[3],e.points[4],e.points[5]);break;case"Q":0===h?h=f/e.pathLength:f>g?h+=(f-g)/e.pathLength:h-=(g-f)/e.pathLength,h>1&&(h=1,l=!0),d=Kinetic.Path.getPointOnQuadraticBezier(h,e.start.x,e.start.y,e.points[0],e.points[1],e.points[2],e.points[3])}void 0!==d&&(g=Kinetic.Path.getLineLength(c.x,c.y,d.x,d.y)),l&&(l=!1,e=void 0)}},k=0;k<f.length&&(j(f[k]),void 0!==c&&void 0!==d);k++){var l=Kinetic.Path.getLineLength(c.x,c.y,d.x,d.y),m=0,n=Kinetic.Path.getPointOnLine(m+l/2,c.x,c.y,d.x,d.y),o=Math.atan2(d.y-c.y,d.x-c.x);this.glyphInfo.push({transposeX:n.x,transposeY:n.y,text:f[k],rotation:o,p0:c,p1:d}),c=d}}},Kinetic.TextPath.prototype._getContextFont=Kinetic.Text.prototype._getContextFont,Kinetic.Util.extend(Kinetic.TextPath,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.TextPath,"fontFamily","Arial"),Kinetic.Factory.addGetterSetter(Kinetic.TextPath,"fontSize",12),Kinetic.Factory.addGetterSetter(Kinetic.TextPath,"fontStyle",d),Kinetic.Factory.addGetterSetter(Kinetic.TextPath,"fontVariant",d),Kinetic.Factory.addGetter(Kinetic.TextPath,"text",c),Kinetic.Collection.mapMethods(Kinetic.TextPath)}(),function(){Kinetic.RegularPolygon=function(a){this.___init(a)},Kinetic.RegularPolygon.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className="RegularPolygon",this.sceneFunc(this._sceneFunc)},_sceneFunc:function(a){var b,c,d,e=this.attrs.sides,f=this.attrs.radius;for(a.beginPath(),a.moveTo(0,0-f),b=1;e>b;b++)c=f*Math.sin(2*b*Math.PI/e),d=-1*f*Math.cos(2*b*Math.PI/e),a.lineTo(c,d);a.closePath(),a.fillStrokeShape(this)}},Kinetic.Util.extend(Kinetic.RegularPolygon,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.RegularPolygon,"radius",0),Kinetic.Factory.addGetterSetter(Kinetic.RegularPolygon,"sides",0),Kinetic.Collection.mapMethods(Kinetic.RegularPolygon)}(),function(){Kinetic.Star=function(a){this.___init(a)},Kinetic.Star.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className="Star",this.sceneFunc(this._sceneFunc)},_sceneFunc:function(a){var b=this.innerRadius(),c=this.outerRadius(),d=this.numPoints();a.beginPath(),a.moveTo(0,0-c);for(var e=1;2*d>e;e++){var f=e%2===0?c:b,g=f*Math.sin(e*Math.PI/d),h=-1*f*Math.cos(e*Math.PI/d);a.lineTo(g,h)}a.closePath(),a.fillStrokeShape(this)}},Kinetic.Util.extend(Kinetic.Star,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.Star,"numPoints",5),Kinetic.Factory.addGetterSetter(Kinetic.Star,"innerRadius",0),Kinetic.Factory.addGetterSetter(Kinetic.Star,"outerRadius",0),Kinetic.Collection.mapMethods(Kinetic.Star)}(),function(){var a=["fontFamily","fontSize","fontStyle","padding","lineHeight","text"],b="Change.kinetic",c="none",d="up",e="right",f="down",g="left",h="Label",i=a.length;Kinetic.Label=function(a){this.____init(a)},Kinetic.Label.prototype={____init:function(a){var b=this;Kinetic.Group.call(this,a),this.className=h,this.on("add.kinetic",function(a){b._addListeners(a.child),b._sync()})},getText:function(){return this.find("Text")[0]},getTag:function(){return this.find("Tag")[0]},_addListeners:function(c){var d,e=this,f=function(){e._sync()};for(d=0;i>d;d++)c.on(a[d]+b,f)},getWidth:function(){return this.getText().getWidth()},getHeight:function(){return this.getText().getHeight()},_sync:function(){var a,b,c,h,i,j,k,l=this.getText(),m=this.getTag();if(l&&m){switch(a=l.getWidth(),b=l.getHeight(),c=m.getPointerDirection(),h=m.getPointerWidth(),k=m.getPointerHeight(),i=0,j=0,c){case d:i=a/2,j=-1*k;break;case e:i=a+h,j=b/2;break;case f:i=a/2,j=b+k;break;case g:i=-1*h,j=b/2}m.setAttrs({x:-1*i,y:-1*j,width:a,height:b}),l.setAttrs({x:-1*i,y:-1*j})}}},Kinetic.Util.extend(Kinetic.Label,Kinetic.Group),Kinetic.Collection.mapMethods(Kinetic.Label),Kinetic.Tag=function(a){this.___init(a)},Kinetic.Tag.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className="Tag",this.sceneFunc(this._sceneFunc)},_sceneFunc:function(a){var b=this.getWidth(),c=this.getHeight(),h=this.getPointerDirection(),i=this.getPointerWidth(),j=this.getPointerHeight(),k=this.getCornerRadius();a.beginPath(),a.moveTo(0,0),h===d&&(a.lineTo((b-i)/2,0),a.lineTo(b/2,-1*j),a.lineTo((b+i)/2,0)),k?(a.lineTo(b-k,0),a.arc(b-k,k,k,3*Math.PI/2,0,!1)):a.lineTo(b,0),h===e&&(a.lineTo(b,(c-j)/2),a.lineTo(b+i,c/2),a.lineTo(b,(c+j)/2)),k?(a.lineTo(b,c-k),a.arc(b-k,c-k,k,0,Math.PI/2,!1)):a.lineTo(b,c),h===f&&(a.lineTo((b+i)/2,c),a.lineTo(b/2,c+j),a.lineTo((b-i)/2,c)),k?(a.lineTo(k,c),a.arc(k,c-k,k,Math.PI/2,Math.PI,!1)):a.lineTo(0,c),h===g&&(a.lineTo(0,(c+j)/2),a.lineTo(-1*i,c/2),a.lineTo(0,(c-j)/2)),k&&(a.lineTo(0,k),a.arc(k,k,k,Math.PI,3*Math.PI/2,!1)),a.closePath(),a.fillStrokeShape(this)}},Kinetic.Util.extend(Kinetic.Tag,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.Tag,"pointerDirection",c),Kinetic.Factory.addGetterSetter(Kinetic.Tag,"pointerWidth",0),Kinetic.Factory.addGetterSetter(Kinetic.Tag,"pointerHeight",0),Kinetic.Factory.addGetterSetter(Kinetic.Tag,"cornerRadius",0),Kinetic.Collection.mapMethods(Kinetic.Tag)}(),function(){Kinetic.Arrow=function(a){this.____init(a)},Kinetic.Arrow.prototype={____init:function(a){Kinetic.Line.call(this,a),this.className="Arrow"},_sceneFunc:function(a){var b=2*Math.PI,c=this.points(),d=c.length,e=c[d-2]-c[d-4],f=c[d-1]-c[d-3],g=(Math.atan2(f,e)+b)%b,h=this.pointerLength(),i=this.pointerWidth();a.save(),a.beginPath(),a.translate(c[d-2],c[d-1]),a.rotate(g),a.moveTo(0,0),a.lineTo(-h,i/2),a.lineTo(-h,-i/2),a.closePath(),a.restore(),this.pointerAtBeginning()&&(a.save(),a.translate(c[0],c[1]),e=c[2]-c[0],f=c[3]-c[1],a.rotate((Math.atan2(-f,-e)+b)%b),a.moveTo(0,0),a.lineTo(-10,6),a.lineTo(-10,-6),a.closePath(),a.restore()),a.fillStrokeShape(this),Kinetic.Line.prototype._sceneFunc.apply(this,arguments)}},Kinetic.Util.extend(Kinetic.Arrow,Kinetic.Line),Kinetic.Factory.addGetterSetter(Kinetic.Arrow,"pointerLength",10),Kinetic.Factory.addGetterSetter(Kinetic.Arrow,"pointerWidth",10),Kinetic.Factory.addGetterSetter(Kinetic.Arrow,"pointerAtBeginning",!1),Kinetic.Collection.mapMethods(Kinetic.Arrow)}();

    //////////////////////