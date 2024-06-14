const express = require('express');
const cors = require('cors');
const ytdlp = require('yt-dlp-exec').default;
const path = require('path');

const app = express();
app.use(cors());

// Rota para baixar o vídeo
app.get('/api/download', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('URL é necessária');
    }

    try {
        res.header('Content-Disposition', 'attachment; filename="video.mp4"');
        ytdlp(url, {
            format: 'mp4'
        }).pipe(res);
    } catch (error) {
        console.error('Erro ao processar o download do vídeo:', error);
        res.status(500).send('Erro ao processar o download do vídeo');
    }
});

// Rota para servir o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
