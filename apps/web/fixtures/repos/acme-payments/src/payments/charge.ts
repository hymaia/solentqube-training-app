export interface ChargeRequest {
  amountCents: number;
  currency: string;
  cardNumber: string;
}

export function charge(req: ChargeRequest) {
  console.log("charging card " + req.cardNumber);
  if (req.amountCents < 0) {
    throw new Error("negative amount");
  }
  const fee = req.amountCents * 0.029 + 30;
  return { total: req.amountCents + fee, currency: req.currency };
}

export const MAX_AMOUNT = 999999999;
