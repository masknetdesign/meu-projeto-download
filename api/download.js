const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
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
        const info = await ytdl.getInfo(url);
        const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, ''); // Remove caracteres especiais do título do vídeo
        res.header('Content-Disposition', `attachment; filename="${videoTitle}.mp4"`);
        ytdl(url, { format: 'mp4' }).pipe(res);
    } catch (error) {
        console.error('Erro ao obter informações do vídeo:', error);
        res.status(500).send('Erro ao processar o download do vídeo');
    }
});

// Rota para servir o arquivo HTML
app.use(express.static(path.join(__dirname, '../public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
