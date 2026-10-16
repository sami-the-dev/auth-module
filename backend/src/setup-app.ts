import { INestApplication, ValidationPipe } from "@nestjs/common";
import helmet from "helmet";

export function setupApp(app: INestApplication, corsOrigin?: string) {
  app.setGlobalPrefix("api");
  app.use(helmet());
  app.enableCors({ origin: corsOrigin?.split(",") });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}
