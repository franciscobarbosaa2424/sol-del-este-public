import * as monedaService from "../services/moneda.service.js";


export const obtenerMonedas = async (req, res) => {
  try {
    const monedas = await monedaService.obtenerMonedas();
    res.json(monedas);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const obtenerNombreMoneda = async (req, res) => {
  try {
    console.log("entra a controladora")
    const { MonedaId } = req.query;

    const moneda = await monedaService.obtenerNombreMoneda(MonedaId);

    res.json(moneda);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};