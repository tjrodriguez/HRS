const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/TJ/Desktop/juswa/conversion/Untitled/src/app/components';
const destComponents = 'src/components/conversion';

if (!fs.existsSync(destComponents)) {
  fs.mkdirSync(destComponents, { recursive: true });
}

const files = fs.readdirSync(srcDir);
files.forEach(file => {
  const fullPath = path.join(srcDir, file);
  if (file.endsWith('.tsx') && !fs.statSync(fullPath).isDirectory()) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // React Router -> Next.js App Router
    content = content.replace(/import\s+\{\s*Link.*\}\s+from\s+['"]react-router-dom['"];/g, "import Link from 'next/link';");
    content = content.replace(/import\s+\{\s*useNavigate.*\}\s+from\s+['"]react-router-dom['"];/g, "import { useRouter } from 'next/navigation';");
    content = content.replace(/const\s+navigate\s*=\s*useNavigate\(\);/g, "const router = useRouter();");
    content = content.replace(/navigate\(/g, "router.push(");
    
    // fix Link attributes
    content = content.replace(/<Link([^>]*)to=/g, "<Link$1href=");

    // handle lucide icons just in case
    // Add "use client" since these use React hooks
    content = '"use client";\n' + content;
    
    fs.writeFileSync(path.join(destComponents, file), content);
    console.log('Migrated', file);
  }
});
