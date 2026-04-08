class NMEA {
    constructor() {}

    satellites() {
        return [
            { prn: 1, elev: 45, az: 100, snr: 40 },
            { prn: 3, elev: 30, az: 200, snr: 35 },
            { prn: 5, elev: 60, az: 300, snr: 50 },
            { prn: 7, elev: 20, az: 50, snr: 20 }
        ];
    }
    generateSatellites(state) {
        const count = state.satellites || 8;
        const prns = state.prns || [];

        let sats = [];

        for (let i = 0; i < count; i++) {

            const prn = prns[i] || Math.floor(Math.random() * 32) + 1;

            const elev = Math.floor(Math.random() * 90);

            const az = Math.floor(Math.random() * 360);

            // SNR más realista (depende de elevación)
            let snr = Math.floor(20 + (elev / 90) * 30);

            sats.push({ prn, elev, az, snr });
        }

        return sats;
    }
    selectFixSatellites(sats) {
        // ordenar por mejor señal (SNR)
        const sorted = [...sats].sort((a, b) => b.snr - a.snr);

        // tomar los mejores 4–12
        return sorted.slice(0, 6); // típico GPS usa 4-8
    }
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
        const sats = !state.moving ? this.satellites() : this.generateSatellites(state);

        const fixSats = this.selectFixSatellites(sats);

        let str = `$GPGSA,${state.mode || 'A'},${state.fixType || 3},`;

        const prns = state.prns || [1,2,3,4,5,6];

        for (let i = 0; i < 12; i++) {
            /* str += (prns[i] ? String(prns[i]).padStart(2, '0') : '') + ","; */
            if (fixSats[i]) {
                str += `${String(fixSats[i].prn).padStart(2, '0')},`;
            } else {
                str += ",";
            }
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
    
        const sats = !state.moving ? this.satellites() : this.generateSatellites(state);

        const totalSats = sats.length;
        const perMessage = 4;
        const totalMsgs = Math.ceil(totalSats / perMessage);

        let messages = [];

        for (let i = 0; i < totalMsgs; i++) {
            let str = `$GPGSV,${totalMsgs},${i + 1},${totalSats}`;

            const chunk = sats.slice(i * perMessage, (i + 1) * perMessage);

            chunk.forEach(s => {
                str += `,${String(s.prn).padStart(2, '0')}`;
                str += `,${String(s.elev).padStart(2, '0')}`;
                str += `,${String(s.az).padStart(3, '0')}`;
                str += `,${String(s.snr).padStart(2, '0')}`;
            });

            str += `*${this.checksum(str)}`;
            return str
            messages.push(str);
        }
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