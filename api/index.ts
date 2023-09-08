import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

interface Triangle {
    x: number;
    y: number;
    z: number;
}

app.post('/compute', (req: Request, res: Response) => {
    const { height, radius, segments } = req.body;

    if (typeof height !== 'number' || typeof radius !== 'number' || typeof segments !== 'number') {
        return res.status(400).json({ error: 'Invalid parameters' });
    }

    try {
        const triangles = computeTriangles(height, radius, segments);
        res.json(triangles);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

const computeTriangles = (H: number, R: number, N: number): Triangle[][] => {
    const triangles: Triangle[][] = [];
    for (let i = 0; i < N; i++) {
        const A = { x: 0, y: 0, z: H };
        const Pi = {
            x: R * Math.cos(2 * Math.PI * i / N),
            y: R * Math.sin(2 * Math.PI * i / N),
            z: 0
        };
        const PiNext = {
            x: R * Math.cos(2 * Math.PI * (i + 1) / N),
            y: R * Math.sin(2 * Math.PI * (i + 1) / N),
            z: 0
        };
        triangles.push([A, Pi, PiNext]);
    }
    return triangles;
};

app.use((err: any, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get('/', (req, res) => {
    res.send('Добро пожаловать на мой сервер!');
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
