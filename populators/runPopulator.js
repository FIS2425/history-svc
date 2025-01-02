import { exec } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();
const populatorName = process.argv[2];

if (!populatorName) {
  console.error("Por favor, proporciona el nombre del archivo populator (por ejemplo, 'ClinicalHistory').");
  process.exit(1);
}

const populatorPath = `./populators/${populatorName}.js`;

exec(`node ${populatorPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error al ejecutar el populator: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  }
  console.log(stdout);
});
