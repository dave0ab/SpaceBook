import { useQuery } from '@tanstack/react-query';
import { spacesService, type Space } from '../services/spaces.service';

export function useSpaces(type?: string) {
  return useQuery<Space[]>({
    queryKey: ['spaces', type],
    queryFn: () => spacesService.getAll(type),
  });
}

export function useSpace(id: string) {
  return useQuery<Space>({
    queryKey: ['spaces', id],
    queryFn: () => spacesService.getById(id),
    enabled: !!id,
  });
}



















