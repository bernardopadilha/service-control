import { z } from 'zod';

export const createOrderSchema = z.object({
  license_plate: z.string({
    invalid_type_error: 'Esse campo não pode ser vázio',
    required_error: 'Esse campo não pode ser vázio',
  }).nonempty('Esse campo não pode ser vázio'),

  model: z.string({
    invalid_type_error: 'Esse campo não pode ser vázio',
    required_error: 'Esse campo não pode ser vázio',
  }).nonempty('Esse campo não pode ser vázio'),

  delivery_prevision: z.string({
    invalid_type_error: 'Selecione uma data de previsão',
    required_error: 'Esse campo não pode ser vázio',
  }),

  car_parts_date: z.date({
    invalid_type_error: 'Selecione a data de previsão de peças',
    required_error: 'Esse campo não pode ser vázio',
  }),

  step: z.string({
    invalid_type_error: 'Selecione uma etapa',
    required_error: 'Esse campo não pode ser vázio',
  }).nonempty('Esse campo não pode ser vázio'),

  technical_id: z.string({
    invalid_type_error: 'Selecione um técnico',
    required_error: 'Esse campo não pode ser vázio',
  }).nonempty('Esse campo não pode ser vázio'),
});

export type CreateOrderData = z.infer<typeof createOrderSchema>;
