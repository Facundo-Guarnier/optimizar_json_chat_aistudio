import packageJson from "../../package.json";

interface PkgJson {
  name: string;
  version: string;
  screenName?: string;
  gitURL?: string;
}

const pkg = packageJson as unknown as PkgJson;

export default function BrandFooter() {
  return (
    <footer className="w-full mt-auto pt-10 pb-6 text-center text-xs text-gray-600">
      <p className="font-medium text-gray-500">{pkg.screenName ?? pkg.name}</p>
      <p className="mt-1">v{pkg.version}</p>
      {pkg.gitURL && (
        <a
          href={pkg.gitURL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-1 text-gray-500 hover:text-gray-300 transition-colors"
        >
          GitHub
        </a>
      )}
    </footer>
  );
}
