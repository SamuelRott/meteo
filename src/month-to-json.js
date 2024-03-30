const fs = require('fs');
const path = require('path');

function parseMonthlySummary(text) {
    const lines = text.split('\n');

    const summary = {
        month: '',
        year: 0,
        days: []
    };

    function parseHeaderLine(line) {
        const match = line.match(/MONTHLY CLIMATOLOGICAL SUMMARY for (\w+)\. (\d+)/);
        if (match) {
            summary.month = match[1];
            summary.year = parseInt(match[2]);
        }
    }

    function parseDataLine(line) {
        const dataMatch = line.match(/^[0-9\s]+(\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(\d+:\d+)\s+(-*\d+\.\d+)\s+(\d+:\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(-*\d+\.\d+)\s+(\d+:\d+|---)\s+(\w+|---)/);
        if (dataMatch) {
            const [_ , day, meanTemp, highTemp, highTempTime, lowTemp, lowTempTime, heatDays, coolDays, rain, windSpeed, highWind, highWindTime, windDir] = dataMatch;
            summary.days.push({
                day: parseInt(_.trim().split(' ')[0]),
                meanTemp: parseFloat(meanTemp),
                highTemp: parseFloat(highTemp),
                highTempTime,
                lowTemp: parseFloat(lowTemp),
                lowTempTime,
                heatDays: parseFloat(heatDays),
                coolDays: parseFloat(coolDays),
                rain: parseFloat(rain),
                windSpeed: parseFloat(windSpeed),
                highWind: parseFloat(highWind),
                highWindTime,
                windDir
            });
        }
    }

    for (const line of lines) {
        if (line.includes('MONTHLY CLIMATOLOGICAL SUMMARY')) {
            parseHeaderLine(line);
        } else if (/^[0-9\s]+\d+\s+/.test(line)) {
            parseDataLine(line);
        }
    }

    return summary;
}

const folderPath = 'data/txt/months';
fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('Error reading folder:', err);
        return;
    }

    files.forEach(file => {
        const filePath = path.join(folderPath, file);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }

            const summary = parseMonthlySummary(data);
            const jsonData = JSON.stringify(summary, null, 2);
            const outputFilePath = path.join('data/json/months', file.replace(/\.[^/.]+$/, '.json'));

            fs.writeFile(outputFilePath, jsonData, (err) => {
                if (err) {
                    console.error('Error writing JSON file:', err);
                }
            });
        });
    });
});
