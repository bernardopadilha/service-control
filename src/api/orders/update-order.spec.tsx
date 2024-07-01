/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { supabase } from "../supabase";
import { toast } from "sonner";
import { OrderProps } from "./create-order";
import { UpdateOrder } from "./update-order";

vi.mock("../supabase", () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    select: vi.fn()
  }
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

describe("UpdateOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update an order successfully", async () => {
    const mockOrderData: OrderProps = {
      id: 1,
      license_plate: "ABC1234",
      model: "Tesla Moddel S",
      entry_date: new Date().toISOString(),
      exit_date: null,
      delivery_prevision: new Date().toISOString(),
      step: "Análise",
      technical_id: "123",
      observation: "",
      created_at: new Date().toISOString()
    };

    const mockResponseData = [{
      ...mockOrderData,
      step: "updated"
    }];

    (supabase.from('orders')
  .update({
    license_plate: mockOrderData.license_plate,
    model: mockOrderData.model,
    entry_date: new Date(),
    exit_date: null,
    delivery_prevision: new Date(mockOrderData.delivery_prevision),
    step: mockOrderData.step,
    technical_id: String(mockOrderData.technical_id),
  })
  .eq('id', mockOrderData.id)
  .select as any).mockResolvedValue({ data: mockResponseData, error: null });

    const data = await UpdateOrder(mockOrderData, "updated");

    expect(data).toEqual(mockResponseData);
    expect(toast.success).toHaveBeenCalledWith("Pedido atualizado com sucesso!");
  });

  it("should handle errors when updating an order", async () => {
    const mockOrderData: OrderProps = {
      id: 1,
      license_plate: "ABC1234",
      model: "Model X",
      entry_date: new Date().toISOString(),
      exit_date: null,
      delivery_prevision: new Date().toISOString(),
      step: "initial",
      technical_id: "123",
      observation: "",
      created_at: new Date().toISOString()
    };

    const mockError = { message: "Something went wrong" };

    (supabase.from('orders')
  .update({
    license_plate: mockOrderData.license_plate,
    model: mockOrderData.model,
    entry_date: new Date(),
    exit_date: null,
    delivery_prevision: new Date(mockOrderData.delivery_prevision),
    step: mockOrderData.step,
    technical_id: String(mockOrderData.technical_id),
  })
  .eq('id', mockOrderData.id)
  .select as any).mockResolvedValue({ data: null, error: mockError });

    await expect(UpdateOrder(mockOrderData, "updated")).rejects.toThrow(mockError.message);
    expect(toast.error).toHaveBeenCalledWith(mockError.message);
  });
});