var tmp = [ { 
    reportTo: [ 2, 3 ],
    nameOfReportTo: [ 'efa fae', 'yonth osdaf' ] },
  { 
    nameOfReportTo: [ 'aaa fff' ],
    reportTo: [ 1 ]
  } ];

for (var i = 0; i < tmp.length; i++) {
	tmp[i].nfrt = [];
	for (var j = 0; j < tmp[i].reportTo.length; j++) {
		var elem = {};
 		elem.re = tmp[i].reportTo[j];
		elem.nre = tmp[i].nameOfReportTo[j];
		tmp[i].nfrt.push(elem);
	}
}

console.log(tmp);


var tmp = [ { 
    reportTo: [ 2, 3 ],
    nameOfReportTo: [ 'efa fae', 'yonth osdaf' ] 
	nfrt: [ {re: 2, nre: 'efa fae'}, {re: 3, nre: 'yonth osdaf'} ]
	},
  { 
    nameOfReportTo: [ 'aaa fff' ],
    reportTo: [ 1 ],
    nfrt: [ {re: 1, nre: 'aaa fff'} ]
  } ];