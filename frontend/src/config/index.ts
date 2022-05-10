interface ConfigInterface {
    API_URL: string;
}
  
  const Config: Partial<ConfigInterface> = {};
  
  export function loadConfigFromObject(object: ConfigInterface): void {
    Object.assign(Config, object);
  }
  
  export async function loadConfigFromFile(): Promise<ConfigInterface> {
    const response = await fetch('/config.json');
    const config = await response.json();
  
    return config;
  }
  
  export default Config;
  