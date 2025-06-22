import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 800,           // 10 utilisateurs virtuels
    duration: '1m',    // Durée du test (1 minute)
    thresholds: {
        http_req_duration: ['p(95)<500'],  // 95% des requêtes < 500ms
        http_req_failed: ['rate<0.01'],    // Moins de 1% d'échec
    }
};

export default function () {
    const url = 'http://192.168.158.129:3000/api/auth/login';

    const payload = JSON.stringify({
        email: "salifbiaye@esp.sn",
        password: "passer123"
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);

    // Vérifications essentielles
    check(res, {
        'Status 200': (r) => r.status === 200,
        'Token reçu': (r) => {
            try {
                const token = r.json('token') || r.json('accessToken');
                return typeof token === 'string' && token.length > 10;
            } catch (e) {
                return false;
            }
        },
        'Temps réponse < 500ms': (r) => r.timings.duration < 500,
    });

    // Debug si nécessaire
    if (res.status !== 200) {
        console.log(`Échec: ${res.status} - ${res.body}`);
    }
}