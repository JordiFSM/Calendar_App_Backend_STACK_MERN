/**
 * Events Routes
 * /api/events
 */

const { Router } = require('express')
const { validarJWT } = require('../middlewares/validar-jwt')
const { getEventos, crearEvento, actualizarEventos, eliminarEventos } = require('../controllers/events')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { isDate } = require('../helpers/isDate')
const router = Router()

router.use( validarJWT );
//Obtener eventos
router.get('/', getEventos);

router.post('/', 
                 [
                    check('title','El titulo es obligatorio').not().isEmpty(),
                    check('start','La fecha de inicio es obligatoria').custom( isDate ),
                    check('end','La fecha de finalización es obligatoria').custom( isDate ),
                    validarCampos
                 ], crearEvento);

router.put('/:id', actualizarEventos);

router.delete('/:id', eliminarEventos); 

module.exports = router;