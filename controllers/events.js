const { response } = require('express');
const Evento = require('../models/Evento')

const getEventos = async (req, res = response) => {

    const eventos = await Evento.find()
                                 .populate('user','name')   ;

    res.json({
        ok: true,
        eventos
    })
}
const crearEvento = async (req, res = response) => {

    const evento = new Evento(req.body);

    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save();

        return res.status(200).json({
            ok: true,
            evento: eventoGuardado
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error server'
        })
    }
}

const actualizarEventos = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById( eventoId );

        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento not found'
            })
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'Usuario sin privilegios'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid 
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true })

        res.json({
            ok: true,
            evento: eventoActualizado
        })



    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error interno'
        })
    }
}
const eliminarEventos = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById( eventoId );

        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento not found'
            })
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'Usuario sin privilegios'
            })
        }

        await Evento.findByIdAndDelete( eventoId)

        res.json({
            ok: true
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error interno'
        })
    }
}
module.exports = {
    getEventos,
    crearEvento,
    actualizarEventos,
    eliminarEventos
}
