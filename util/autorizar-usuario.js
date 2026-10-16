
const autorizarUsuario = ( req, res, next ) =>{
  const auth = req.signedCookies.auth;
  if(!auth){
    return res.status(401).send({ error: 'usuario no autorizado.' });
  }
  next();
}

export default autorizarUsuario;