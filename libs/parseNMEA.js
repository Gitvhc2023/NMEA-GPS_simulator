function used_talker_IDs(Ids) {
  // * GP for GPS only solutions
  // * GL for GLONASS only solutions
  // * GA for GALILEO only solutions
  // * GN for multi GNSS solutions
  var talkerId
  if (Ids.indexOf("$GP") > -1){
    talkerId= "GPS"
  }
  if (Ids.indexOf("$GL") > -1){
    talkerId= "GLONASS"
  }
  if (Ids.indexOf("$GA") > -1){
    talkerId= "GALILEO"
  }
  if (Ids.indexOf("$GN") > -1){
    talkerId= "GNSS"
  }
  return talkerId
}
function parseTime(time, date) {
    //console.log('time',time, date)
    if (time === '') {
      return null;
    }

    var ret = new Date();

    if (date) {

      var year = date.slice(4);
      var month = date.slice(2, 4) - 1;
      var day = date.slice(0, 2);

      if (year.length === 4) {
        ret.setUTCFullYear(year, month, day);
      } else {
        // If we need to parse older GPRMC data, we should hack something like
        // year < 73 ? 2000+year : 1900+year
        // Since GPS appeared in 1973
        ret.setUTCFullYear((year < 73 ? 2000 :1900) + (year * 1), month, day);
      }
    }

    ret.setUTCHours(time.slice(0, 2));
    ret.setUTCMinutes(time.slice(2, 4));
    ret.setUTCSeconds(time.slice(4, 6));
    // Extract the milliseconds, since they can be not present, be 3 decimal place, or 2 decimal places, or other?
    var msStr = time.slice(7);
    var msExp = msStr.length;
    var ms = 0;
    if (msExp !== 0) {
      ms = parseFloat(msStr) * Math.pow(10, 3 - msExp);
    }
    ret.setUTCMilliseconds(ms);
    // console.log('UTC:',ret)
    // console.log('time:',ret.toISOString())
    // console.log('date:',ret.toDateString())
    return ret.toUTCString();
  }
function getlan(coord, dir) {
  //Latitude = N or S
  //var lat = `${coorlan.slice(2,5)} ${coorlan.slice(5)}` //substring(0, 2))  //.toFixed(5)
  if(coord.length > 6 && dir.length > 0){
    if(dir=='S'){
      return 0 - (Number(coord.slice(0, 2)) + Number(coord.slice(2,coord.length) / 60));
    }else{
      return Number(coord.slice(0, 2)) + Number(coord.slice(2,coord.length) / 60);
    }
  }else{
    return '0.000000'
  }

}
function getlon(coord, dir) {
  //Longitude = E or W
  //var lon = `0${coorlon.slice(1,3)} ${coorlon.slice(3)}`;
  if(coord.length > 6 && dir.length > 0){
    if(dir=='W'){
      return 0 - (Number(coord.slice(0, 3)) + Number(coord.slice(3,coord.length) / 60));
    }else{
      return Number(coord.slice(0, 3)) + Number(coord.slice(3,coord.length) / 60);
    }
  }else{
    return '0.000000'
  }

}

function parseNumber(num) {
  //console.log('parse number',num)
  if (num === '') {
    return null;
  }
  return parseFloat(num);
}

function parseKnots(knots) {

    if (knots === '') {
      return null;
    }
    var speed= parseFloat(knots) * 1.852;
    return speed.toFixed(2);
  }

function GSAMode(mode) {

    switch (mode) {
      case 'M':
        return 'manual';
      case 'A':
        return 'automatic';
      case '':
        return null;
    }
    throw new Error('INVALID GSA MODE: ' + mode);
  }

function GGAFix(fix) {

    switch (fix) {
      case '':
      case '0':
        return null;
      case '1':
        return 'fix'; // valid SPS fix
      case '2':
        return 'dgps-fix'; // valid DGPS fix
      case '3':
        return 'pps-fix'; // valid PPS fix
      case '4':
        return 'rtk'; // valid (real time kinematic) RTK fix
      case '5':
        return 'rtk-float'; // valid (real time kinematic) RTK float
      case '6':
        return 'estimated'; // dead reckoning
      case '7':
        return 'manual';
      case '8':
        return 'simulated';
    }
    throw new Error('INVALID GGA FIX: ' + fix);
  }

function GSAFix(fix) {

    switch (fix) {
      case '':
      case '1':
        return null;
      case '2':
        return '2D';
      case '3':
        return '3D';
    }
    throw new Error('INVALID GSA FIX: ' + fix);
  }

function RMC_GLLStatus(status) {

    switch (status) {
      case '':
        return null;
      case 'A':
        return 'active';
      case 'V':
        return 'void';
    }
    throw new Error('INVALID RMC/GLL STATUS: ' + status);
}
function parseFAA(faa) {

    // Only A and D will correspond to an Active and reliable Sentence

    switch (faa) {
      case '':
        return null;
      case 'A':
        return 'autonomous';
      case 'D':
        return 'differential';
      case 'E':
        return 'estimated'; // dead reckoning
      case 'M':
        return 'manual input';
      case 'S':
        return 'simulated';
      case 'N':
        return 'not valid';
      case 'P':
        return 'precise';
      case 'R':
        return 'rtk'; // valid (real time kinematic) RTK fix
      case 'F':
        return 'rtk-float'; // valid (real time kinematic) RTK float
    }
    throw new Error('INVALID FAA MODE: ' + faa);
  }

function parseRMCVariation(vari, dir) {

    if (vari === '' || dir === '')
      return null;

    var q = (dir === 'W') ? -1.0 : 1.0;

    return parseFloat(vari) * q;
  }

function isValid(str, crc) {

    var checksum = 0;
    for (var i = 1; i < str.length; i++) {
      var c = str.charCodeAt(i);

      if (c === 42) // Asterisk: *
        break;

      checksum ^= c;
    }
    return checksum === parseInt(crc, 16);
  }

function parseDist(num, unit) {
  if (unit === 'M' || unit === '') {
      //console.log('Parse Dist',parseNumber(num), unit)
      return parseNumber(num);
    }
    throw new Error('Unknown unit: ' + unit);
}
function Heading(lat1, lon1, lat2, lon2) {
  var dlon = (lon2 - lon1) * D2R;

  lat1 = lat1 * D2R;
  lat2 = lat2 * D2R;

  var sdlon = Math.sin(dlon);
  var cdlon = Math.cos(dlon);

  var slat1 = Math.sin(lat1);
  var clat1 = Math.cos(lat1);

  var slat2 = Math.sin(lat2);
  var clat2 = Math.cos(lat2);

  var y = sdlon * clat2;
  var x = clat1 * slat2 - slat1 * clat2 * cdlon;

  var head = Math.atan2(y, x) * 180 / Math.PI;

  return (head + 360) % 360;

}
function Distance(lat1, lon1, lat2, lon2) {
  var RADIUS = 6372.8; // Earth radius in km

  var hLat = (lat2 - lat1) * D2R * 0.5; // Half of lat difference
  var hLon = (lon2 - lon1) * D2R * 0.5; // Half of lon difference
  lat1 = lat1 * D2R;
  lat2 = lat2 * D2R;
  var shLat = Math.sin(hLat);
  var shLon = Math.sin(hLon);
  var clat1 = Math.cos(lat1);
  var clat2 = Math.cos(lat2);
  var tmp = shLat * shLat + clat1 * clat2 * shLon * shLon;
  //return RADIUS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
  return RADIUS * 2 * Math.asin(Math.sqrt(tmp));

}
function confluence(lat,lon) {
  var lat1 = lat;
  var lon1 = lon;
  // Find closest confluence point as destination
  var lat2 = Math.round(lat1);
  var lon2 = Math.round(lon1);
  return {
    'heading':`${Heading(lat1, lon1, lat2, lon2)} \xba`,
    'distance':`${Distance(lat1, lon1, lat2, lon2)} km`,
    'point': `${lat1}, ${lon1}`
  }
}
let nmea = {}//new Object();
var D2R = Math.PI / 180;
var Confluence = {}
class PARSE_NMEA {
    constructor() {
        Object.assign(this,nmea);
        if(nmea.type=='RMC' || nmea.type=='GGA'){
          nmea['confluence'] = confluence(nmea.lat,nmea.lat);
        }
    }
    merge(...arr){
        return arr.reduce((acc, val) => {
            return { ...acc, ...val  };
        }, {});
    }
    getConfluence(lat,lon){
      Confluence['confluence'] = confluence(lat,lon);
    }
    
    GGA(str,gga){
      if (gga.length !== 16 && gga.length !== 14) {
        throw new Error('Invalid GGA length:'+str);
      }
      return  {
        time:parseTime(gga[1]),
        lat:getlan(gga[2], gga[3]),
        lon:getlon(gga[4], gga[5]),
        alt:parseDist(gga[9], gga[10]),
        quality:GGAFix(gga[6]),
        // confluence:confluence(getlan(gga[2], gga[3]),getlon(gga[4], gga[5])),
        value:gga[6],
        satellites_view: parseNumber(gga[7]),
        dilution: parseNumber(gga[8]), // dilution
        geoidal: parseDist(gga[11], gga[12]), // aboveGeoid
        age: gga[13] === undefined ? null : parseNumber(gga[13]), // dgps time since update
        stationID: gga[14] === undefined ? null : parseNumber(gga[14]), // dgpsReference??
      }

    }
    GSA(str,gsa){
      //$GPGSA,A,3,01,02,04,12,03,09,22,,,,,,1.0,1.0,1.0*3d
      /**
          0   1 2  3  4  5  6  7  8  9       15  16  17
        $GPGSA,A,3,01,02,04,12,03,09,22,,,,,,1.0,1.0,1.0*3d
        */
      if (gsa.length !== 19 && gsa.length !== 20) {
        throw new Error('Invalid GSA length: '+ str);
      }

      var sats = [];
      for (var i = 3; i < 15; i++) {
        if (gsa[i] !== '') {
          //sats.push(parseInt(gsa[i], 10));
          sats.push(gsa[i]);
        }
      }
      return {
        mode: GSAMode(gsa[1]),
        fix: GSAFix(gsa[2]),
        value:gsa[2],
        satellites_used: sats,      //PRNs of satellites used for fix (space for 12)
        pdop: parseNumber(gsa[15]),
        hdop: parseNumber(gsa[16]),
        vdop: parseNumber(gsa[17].slice(0,4)),
        systemId: gsa.length > 19 ? parseNumber(gsa[18]) : null,
      }

    }
    RMC(str,rmc){
      if (rmc.length !== 13 && rmc.length !== 14 && rmc.length !== 15) {
        throw new Error('Invalid RMC length: '+str);
      }
      return {
        time: parseTime(rmc[1], rmc[9]),
        status: RMC_GLLStatus(rmc[2]),
        lat: getlan(rmc[3], rmc[4]),
        lon: getlon(rmc[5], rmc[6]),
        speed: parseKnots(rmc[7]),
        //track: parseNumber(rmc[8]), // heading
        // confluence:confluence(getlan(rmc[3], rmc[4]),getlon(rmc[5], rmc[6])),
        heading: parseNumber(rmc[8]), // heading
        variation: parseRMCVariation(rmc[10], rmc[11]),
        faa: rmc.length > 13 ? parseFAA(rmc[12]) : null,
        navStatus: rmc.length > 14 ? rmc[13] : null,
      }
    }
    GSV(str,gsv){
        var sats = [];

        if (gsv.length % 4 === 0) {
          throw new Error('Invalid GSV length: '+str);
        }
        for (var i = 4; i < gsv.length - 3; i += 4) {

          var prn = parseNumber(gsv[i]);
          var snr = parseNumber(gsv[i + 3]);
          /*
            Plot satellites in Radar chart with north on top
            by linear map elevation from 0° to 90° into r to 0
            centerX + cos(azimuth - 90) * (1 - elevation / 90) * radius
            centerY + sin(azimuth - 90) * (1 - elevation / 90) * radius
            */
          sats.push({
            'prn': prn,
            'elevation': parseNumber(gsv[i + 1]),
            'azimuth': parseNumber(gsv[i + 2]),
            'snr': snr,
            'status': prn !== null ? (snr !== null ? 'tracking' : 'in view') : null
          });
        }

        return {
          msgNumber: parseNumber(gsv[2]),
          msgsTotal: parseNumber(gsv[1]),
          satsInView: parseNumber(gsv[3]),
          satellites: sats,
          signalId: gsv.length % 4 === 2 ? parseNumber(gsv[gsv.length - 2]) : null
        }
    }
    isData(raw_line) {
        //
        if (typeof raw_line !== 'string') return false;
        var nmea_parse = raw_line.split(',');
        var last = nmea_parse.pop();
        if (nmea_parse.length < 2 || raw_line.charAt(0) !== '$' || last.indexOf('*') === -1) {
          return false;
        }
        last = last.split('*');
        nmea_parse.push(last[0]);
        nmea_parse.push(last[1]);
        
        if (raw_line.indexOf("$GPGGA,") > -1) {
          nmea = this.GGA(raw_line,nmea_parse);
        }
        else if (raw_line.indexOf("$GPGSA,") > -1) {
          nmea = this.GSA(raw_line,nmea_parse);
        }
        else if (raw_line.indexOf("$GPRMC,") > -1) {
          nmea = this.RMC(raw_line,nmea_parse);
        }
        else if (raw_line.indexOf("$GPGSV,") > -1) {
          // var gsv = "$GPGSV,2,1,08,01,40,083,46,02,17,308,41,12,07,344,39,14,22,228,45*75"
          nmea = this.GSV(raw_line,nmea_parse);
        }
        nmea['valid'] = isValid(raw_line, nmea_parse[nmea_parse.length - 1]);
        nmea['raw'] = raw_line
        nmea['talkerId'] = used_talker_IDs(raw_line);
        nmea['type'] = nmea_parse[0].slice(3);
        return nmea
        //return Object.assign(this,nmea);

    }
    /* isData(state) {
      //console.log("raw data",state)
      return {plot:this.rawData(state)}
    } */

}
//module.exports= PARSE_NMEA
export default PARSE_NMEA