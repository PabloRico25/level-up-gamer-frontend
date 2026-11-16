
import { useContext, useState } from 'react'
import { SesionContext } from '../context/tiendaContext.js'
import { Link, useNavigate } from 'react-router-dom'

function Login() {

  const navigate = useNavigate()

  const { iniciarSesion: guardarSesion } = useContext(SesionContext)

  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [errores, setErrores] = useState({})
  const [cargando, setCargando] = useState(false)

  // Iniciar sesión con Spring Boot
  async function iniciarSesion(e) {
    e.preventDefault()

    const nuevosErrores = {}
    const correoLimpio = correo.trim().toLowerCase()

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // Validar correo
    if (!correoLimpio) {
      nuevosErrores.correo = 'Ingresa tu correo electrónico.'
    } else if (correoLimpio.length > 100) {
      nuevosErrores.correo =
        'El correo no puede superar los 100 caracteres.'
    } else if (!correoValido.test(correoLimpio)) {
      nuevosErrores.correo =
        'Ingresa un correo electrónico válido.'
    }

    // Validar contraseña
    if (!contrasena) {
      nuevosErrores.contrasena = 'Ingresa tu contraseña.'
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    setErrores({})
    setCargando(true)

    try {

      // Enviar credenciales a Spring Boot
      await guardarSesion(correoLimpio, contrasena)

      // Volver al inicio si el login es correcto
      navigate('/')

    } catch (error) {

      console.error('Error al iniciar sesión:', error.message)

      if (error instanceof TypeError) {
        setErrores({
          general: 'No se pudo conectar con el servidor.'
        })
      } else {
        setErrores({
          general: 'Correo o contraseña incorrectos, o no fue posible iniciar sesión.'
        })
      }

    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="login-main">

      <section className="login-contenedor">

        <div className="ruta-productos">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <span>Ingresar</span>
        </div>

        <div className="encabezado-login">
          <p className="hero-etiqueta">INICIA SESIÓN</p>

          <h1>Ingresa a tu cuenta</h1>

          <p>
            Inicia sesión para seguir con tu compra
            y ver tu descuento Duoc.
          </p>
        </div>

        <form
          className="form-login"
          onSubmit={iniciarSesion}
          noValidate
        >

          {/* Correo */}
          <div className="campo-login">
            <label htmlFor="correo">
              Correo electrónico
            </label>

            <input
              id="correo"
              type="email"
              maxLength={100}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className={errores.correo ? 'campo-error' : ''}
              disabled={cargando}
            />

            <p className="error">{errores.correo}</p>
          </div>

          {/* Contraseña */}
          <div className="campo-login">
            <label htmlFor="contrasena">
              Contraseña
            </label>

            <input
              id="contrasena"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className={errores.contrasena ? 'campo-error' : ''}
              disabled={cargando}
            />

            <p className="error">{errores.contrasena}</p>
          </div>

          <button
            type="submit"
            className="boton-login"
            disabled={cargando}
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>

          <p className="login-error" role="alert">
            {errores.general}
          </p>

          <p className="texto-login">
            ¿No tienes cuenta?{' '}
            <Link to="/registro">Regístrate</Link>
          </p>

        </form>
      </section>
    </main>
  )
}

export default Login
