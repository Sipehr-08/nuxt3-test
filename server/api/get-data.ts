import { promises as fs } from 'fs';
import { defineEventHandler } from 'h3';
import { resolve } from 'path';

export default defineEventHandler(async () => {
    try {
        const filePath = resolve(process.cwd(), 'task_json.txt');
        const jsonData = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        throw new Error('Failed to read JSON data');
    }
});
