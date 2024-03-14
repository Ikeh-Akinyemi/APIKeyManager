import type { AppRouter } from '../../../server/src/api/router/_app';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();
