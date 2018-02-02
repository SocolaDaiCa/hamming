const app = new Vue({
	el: "#app",
	data: {
		hammingIn: "",
		hammingBit: "",
		bitErr: "",
		ip1: "",
		ip2: "",
		mask: "",
		class: "",
		chanleIn: "",
		dec:"",
		bin: "",
		tring: "",
		/*check Sum*/
		inputCheckSum: "",
		inputCRC: "",
		inputG: ""
	},
	methods: {

	},
	computed: {
		resHamming: function() {
			if(this.hammingIn == "") return "";
			var s = dectobin(this.hammingIn.charCodeAt(0));
			var hammingCode = " ";
			var x = 0;
			for(let i = 1; i<=12; i++)
				if(i == 1 || i == 2 || i == 4 || i == 8)
					hammingCode += "0";
				else hammingCode += s[x++];
			hammingCode = hammingCode.split("");
			let arr = [1, 2, 4, 8];
			arr.forEach(function(item) {
				let count = 0;
				for(let i = item; i<=12; i+= 2*item){
					for(let j = 0; j<item && (i+j) <= 12; j++)
						if(hammingCode[i + j] == "1") count++;
				}
				hammingCode[item] = (count%2).toString();
			});
			return hammingCode.join("");
		},
		hammingDeCode: function () {
			this.hammingBit = this.hammingBit.replace(/ /g, "");
			var s = (" " + this.hammingBit).split("");
			var l = s.length - 1;
			var arr = [1, 2, 4, 8];
			var err = 0;
			arr.forEach(function (item) {
				let count = 0;
				for(let i = item; i<=l; i+= 2*item){
					for(let j = 0; j<item && (i+j) <= l; j++)
						if(s[i + j] == "1") count++;
				}
				if(count % 2 != 0) err += item;
			});
			if(s[err] = "1")
				s[err] = "0";
			else s[err] = "1";
			let res = 0;
			for(let i = 1; i<=l; i++)
				if(i!=1 && i != 2 && i != 4 && i != 8){
					res = res * 2;
					if(s[i] == "1") res += 1;
				}
			return String.fromCharCode(res);
		},
		bitErr: function () {
			var s = (" " + this.hammingBit).split("");
			var arr = [1, 2, 4, 8];
			var err = 0;
			arr.forEach(function (item) {
				let count = 0;
				for(let i = item; i<=12; i+= 2*item){
					for(let j = 0; j<item && (i+j) <= 12; j++)
						if(s[i + j] == "1") count++;
				}
				if(count % 2 != 0) err += item;
			});
			return err;
		},
		resAndIP: function() {
			this.ip1 = this.ip1.replace(" ", "");
			var arr1 = this.ip1.split(".");
			var arr2 = this.ip2.split(".");
			var res1 = [];
			if(arr1.length !=4 && arr2.length !=4)
				return "error";
			for(let i = 0; i<arr1.length; i++){
				if(isNaN(arr1[i]) || isNaN(arr2[i]))
					return "err";
				res1.push(parseInt(arr1[i]) & parseInt(arr2[i]));
			}
			return res1.join(".");
		},
		resAndIPBit: function () {
			var arr  = this.resAndIP.split(".");
			if(arr.length != 4) return "error";
			for (var i = arr.length - 1; i >= 0; i--) {
				arr[i] = dectobin(arr[i]);
			}
			return arr.join(" ");
		},
		getS: function() {
			var arr = this.mask.split(".");
			if(arr.length != 4) return "err";
			for(let i = 0; i<arr.length; i++)
				if(isNaN(arr[i]))
					return "err";
			var s = "";
			switch(this.class){
				case "A": s+=dectobin(arr[1]);
				case "B": s+=dectobin(arr[2]);
				case "C": s+=dectobin(arr[3]);
			}
			return s;
		},
		netChild: function() {
			var s = this.getS;
			var i = 0;
			while(s[i]=="1") i++;
			return Math.pow(2, i);
		},
		pcPerNet: function () {
			var s = this.getS;
			var i = 0;
			while(s[i]=="1") i++;
			return Math.pow(2, s.length - i) - 2;
		},
		resChanLe: function() {
			let s = "";
			this.chanleIn.split("").forEach(function(key) {
				s+= dectobin(key.charCodeAt(0));
			});
			let x = s.split("");
			x.forEach(function(key, index) {
				x[index]+=(((key.split("1").length - 1) % 2).toString());
			});
			let y = "";
			return x.join("");
		},
		dectobin: function() {
			if(!isNaN(this.dec))
				return dectobin(this.dec);
			let res = "";
			this.dec.split("").forEach(function(key) {
				res += dectobin(key.charCodeAt(0))
			});
			return res;
		},
		resCheckSum: function() {
			let s = "";
			this.inputCheckSum.split("").forEach(function(key) {
				s += dectobin(key.charCodeAt(0));
			});
			if(s.length % 16) s += "00000000";
			let x = binToDec(s.slice(0, s.length / 2));
			let y = binToDec(s.slice(s.length / 2, s.length));
			console.log(s.slice(0, s.length / 2 - 1));
			console.log(s.slice(s.length / 2, s.length - 1));
			res = dectobin(x+y).split("");
			res.forEach(function(key, index) {
				console.log(key);
				if(key == "1") res[index] = "0";
				else res[index] = "1";
			})
			return res.join("");
		},
		resCRC: function() {
			let d = "";
			this.inputCRC.split("").forEach(function(key) {
				d += dectobin(key.charCodeAt(0));
			});
			d = d.padEnd(d.length + this.inputG.length - 1, "0").split("");
			let g = this.inputG.split("");
			let ld = d.length;
			let lg = g.length;
			for(let i = 0; i< ld - lg + 1; i++){
				if(d[i] == "0") continue;
				for(let j = 1; j<lg; j++){
					if(d[i + j] == g[j]) d[i + j] = "0";
					else d[i + j] = "1";
				}
			}
			d = d.join("");
			return d.slice(ld - lg + 1, ld + 1);
		}
	}
});
function binToDec(s) {
	return parseInt(s, 2);
	// let res = 0;
	// s.split("").forEach(function(key) {
	// 	res *= 2;
	// 	if(key == "1") res += 1;
	// });
}
function dectobin(x) {
	res = "";
	x = parseInt(x);
	if(isNaN(x))
		return "NaN";
	res = (x >>> 0).toString(2);
	// while(x){
	// 	res = (x%2).toString() + res;
	// 	x = parseInt(x/2);
	// }
	while(res.length % 8 || res.length == 0){
		res = "0" + res;
	}
	return res;
}