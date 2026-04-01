class NMEA {
    constructor() {}

    // ---------------- CHECKSUM ----------------
    checksum(sentence) {
        let cs = 0;
        for (let i = 1; i < sentence.length; i++) {
            cs ^= sentence.charCodeAt(i);
        }
        return cs.toString(16).toUpperCase().padStart(2, '0');
    }

    // ---------------- FORMAT HELPERS ----------------
    formatLat(lat, decimals = 4) {
        const deg = Math.floor(Math.abs(lat));
        const min = (Math.abs(lat) - deg) * 60;
        return `${String(deg).padStart(2, '0')}${min.toFixed(decimals)},${lat < 0 ? 'S' : 'N'}`;
    }

    formatLon(lon, decimals = 4) {
        const deg = Math.floor(Math.abs(lon));
        const min = (Math.abs(lon) - deg) * 60;
        return `${String(deg).padStart(3, '0')}${min.toFixed(decimals)},${lon < 0 ? 'W' : 'E'}`;
    }

    formatTime(date) {
        return date.toISOString().substr(11, 8).replace(/:/g, '');
    }

    formatDate(date) {
        return (
            String(date.getDate()).padStart(2, '0') +
            String(date.getMonth() + 1).padStart(2, '0') +
            String(date.getFullYear()).slice(-2)
        );
    }

    // ---------------- GGA ----------------
    GGA(state) {
        const time = this.formatTime(state.date);

        let str = `$GPGGA,${time},`;

        str += this.formatLat(state.lat) + ",";
        str += this.formatLon(state.lon) + ",";

        str += `${state.fix},`;
        str += `${String(state.satellites).padStart(2, '0')},`;
        str += `${state.hdop},`;
        str += `${state.alt},M,`;
        str += `0.0,M,,`;

        str += `*${this.checksum(str)}`;

        return str;
    }

    // ---------------- GSA ----------------
    GSA(state) {
        let str = `$GPGSA,${state.mode || 'A'},${state.fixType || 3},`;

        const prns = state.prns || [1,2,3,4,5,6];

        for (let i = 0; i < 12; i++) {
            str += (prns[i] ? String(prns[i]).padStart(2, '0') : '') + ",";
        }

        str += `${state.pdop || 1.0},`;
        str += `${state.hdop || 1.0},`;
        str += `${state.vdop || 1.0}`;

        str += `*${this.checksum(str)}`;

        return str;
    }

    // ---------------- RMC ----------------
    RMC(state) {
        const time = this.formatTime(state.date);
        const date = this.formatDate(state.date);

        let str = `$GPRMC,${time},${state.status || 'A'},`;

        str += this.formatLat(state.lat) + ",";
        str += this.formatLon(state.lon) + ",";

        str += `${(state.speed * 0.5399568).toFixed(2)},`; // knots
        str += `${state.heading.toFixed(1)},`;

        str += `${date},`;
        str += `000.0,N`;

        str += `*${this.checksum(str)}`;

        return str;
    }

    // ---------------- GSV ----------------
    GSV(state) {
        const sats = state.satellitesInfo || [
            { prn: 1, elev: 45, az: 100, snr: 40 },
            { prn: 3, elev: 30, az: 200, snr: 35 },
            { prn: 5, elev: 60, az: 300, snr: 50 },
            { prn: 7, elev: 20, az: 50, snr: 20 }
        ];

        let str = `$GPGSV,1,1,${sats.length}`;

        sats.forEach(s => {
            str += `,${s.prn},${s.elev},${s.az},${s.snr}`;
        });

        str += `*${this.checksum(str)}`;

        return str;
    }

    // ---------------- ENCODER GENERAL ----------------
    encodeAll(state) {
        return {
            gga: this.GGA(state),
            gsa: this.GSA(state),
            rmc: this.RMC(state),
            gsv: this.GSV(state)
        };
    }
}

//module.exports = NMEA;
export default NMEA