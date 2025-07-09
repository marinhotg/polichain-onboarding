/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

async function main() {
  const artifactPath = path.join(__dirname, '../artifacts/contracts/ItemManager.sol/ItemManager.json');
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  
  const abi = artifact.abi;
  
  const content = `// Auto-gerado pelo script extract-abi.js
export const ItemManagerABI = ${JSON.stringify(abi, null, 2)} as const;

// COLE AQUI O ENDEREÇO DO DEPLOY:
export const ITEM_MANAGER_ADDRESS = "SEU_ENDERECO_AQUI" as const;
`;

  const outputPath = path.join(__dirname, '../src/lib/contracts.ts');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content);
  
  console.log('✅ ABI extraído para src/lib/contracts.ts');
  console.log('⚠️  Lembre-se de atualizar o ITEM_MANAGER_ADDRESS!');
}

main().catch(console.error);