import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  
  // Validation des erreurs spécifiques
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON syntax" });
  }

  // Gestion des erreurs spécifiques
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  
    // Gestion des routes invalides
    if (err.message === "Route not found") {
      return res.status(404).json({ error: "Invalid route" });
    }

  // Gestion des erreurs de validation
  if (err.name === "ValidationError") {
    return res.status(422).json({ error: err.message });
  }

  // Autres erreurs non gérées
  return res.status(500).json({ error: "Something went wrong" });
};