//Importa módulo de configuração
import { ServiceConfiguration } from 'meteor/service-configuration';

/**
 * Configurações de Login do Google
 */
ServiceConfiguration.configurations.remove({
  service: "google"
});
ServiceConfiguration.configurations.insert({
  service: "google",
  clientId: "654691812108-5sl5uv0ltr9rt3ie0bgbbn37ku6uch1h.apps.googleusercontent.com",
  secret: "AktO44TYzGgdNG8ZTjv5_thY"
});

/**
 * Configurações de Login do GitHub
 */
ServiceConfiguration.configurations.remove({
  service: "github"
});
ServiceConfiguration.configurations.insert({
  service: "github",
  loginStyle: "popup",
  clientId: "75f304e20609d4b54473",
  secret: "bafb4800c5509e368d3154f8027d7494d42e6de1"
});
