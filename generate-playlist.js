const fs = require('fs');
const path = require('path');
const mm = require('music-metadata');

const musicDir = path.join(__dirname, 'music');
const output = [];

fs.readdir(musicDir, async (err, files) => {
  if (err) {
    console.error('Помилка читання папки:', err);
    return;
  }

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext !== '.mp3') continue;

    const filePath = path.join(musicDir, file);
    try {
      const metadata = await mm.parseFile(filePath);
      const artist = metadata.common.artist || 'Unknown Artist';
      const title = metadata.common.title || path.basename(file, '.mp3');

      output.push({
        src: `music/${file}`,
        artist,
        title
      });
    } catch (e) {
      console.warn(`Не вдалося зчитати ${file}:`, e.message);
    }
  }

  fs.writeFileSync('playlist.json', JSON.stringify(output, null, 2), 'utf-8');
  console.log('✅ Плейлист згенеровано!');
});
