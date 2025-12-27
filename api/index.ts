
import { createApp } from '../server/_core/index.js';

export default async function handler(req, res) {
    const { app } = await createApp();
    app(req, res);
}
