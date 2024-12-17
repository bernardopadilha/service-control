/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { supabase } from "../supabase";
import { toast } from "sonner";
import { CreateOrderData } from "@/lib/zod/create-order.zod";
import { createOrder } from "./create-order";

vi.mock("../supabase", () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    select: vi.fn()
  }
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

describe("createOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create an order successfully", async () => {
    const mockOrderData: CreateOrderData = {
      license_plate: "ABC1234",
      model: "Model X",
      delivery_prevision: new Date().toISOString(),
      step: "initial",
      technical_id: "123",
      car_parts_date: new Date(),
    };

    const mockResponseData = [{
      id: 1,
      license_plate: mockOrderData.license_plate,
      model: mockOrderData.model,
      entry_date: new Date().toISOString(),
      exit_date: null,
      delivery_prevision: new Date(mockOrderData.delivery_prevision).toISOString(),
      step: mockOrderData.step,
      technical_id: String(mockOrderData.technical_id),
      observation: "",
      created_at: new Date().toISOString()
    }];

    (supabase.from('orders').insert([{
      license_plate: mockOrderData.license_plate,
      model: mockOrderData.model,
      entry_date: new Date(),
      exit_date: null,
      delivery_prevision: new Date(mockOrderData.delivery_prevision),
      step: mockOrderData.step,
      technical_id: String(mockOrderData.technical_id),
      observation: ''
    }]).select as any).mockResolvedValue({ data: mockResponseData, error: null });

    const data = await createOrder(mockOrderData);

    expect(data).toEqual(mockResponseData);
    expect(toast.success).toHaveBeenCalledWith("Pedido gerado com sucesso!");
  });

  it("should handle errors when creating an order", async () => {
    const mockOrderData: CreateOrderData = {
      license_plate: "ABC1234",
      model: "Model X",
      delivery_prevision: new Date().toISOString(),
      step: "initial",
      technical_id: "123",
      car_parts_date: new Date()
    };

    const mockError = { message: "Something went wrong" };

    (supabase.from('orders').insert([{
      license_plate: mockOrderData.license_plate,
      model: mockOrderData.model,
      entry_date: new Date(),
      exit_date: null,
      delivery_prevision: new Date(mockOrderData.delivery_prevision),
      step: mockOrderData.step,
      technical_id: String(mockOrderData.technical_id),
      observation: ''
    }]).select as any).mockResolvedValue({ data: null, error: mockError });

    await expect(createOrder(mockOrderData)).rejects.toThrow(mockError.message);
    expect(toast.error).toHaveBeenCalledWith(mockError.message);
  });
});
