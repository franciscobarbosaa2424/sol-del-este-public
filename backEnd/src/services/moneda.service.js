import * as MonedaModel from "../models/moneda.model.js";

export const obtenerMonedas = async () => {
  const monedas = await MonedaModel.obtenerMonedas();

  if (monedas.length === 0) {
    throw new Error("No hay monedas");
  }

  return monedas;
};

export const obtenerNombreMoneda = async (id) => {

  if (!id) {
    throw new Error("MonedaId es requerido");
  }

  const moneda = await MonedaModel.obtenerNombreMoneda(id);

  if (!moneda) {
    throw new Error("Moneda no encontrada");
  }

  return moneda;
};

