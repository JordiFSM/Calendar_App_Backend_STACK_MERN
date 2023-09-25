const { response } = require('express')
const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res = response ) => {

    const { email, password } = req.body

    try {

        let usuario = await Usuario.findOne({ email });
        if ( usuario ) {
            return res.status(400).json({
                ok: true,
                msg: 'Exite este correo registrado'
            });
        }

        usuario = new Usuario( req.body);
        //encryptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt);


        await usuario.save();

        //Generar JWT
        const token = await generarJWT( usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error'
        })
    }
    
}

const loginUsuario = async (req, res= response) => {

    const { email, password } = req.body

    try {
        //validar usuario
        const usuario = await Usuario.findOne({ email });
        if ( !usuario ) {
            return res.status(400).json({
                ok: true,
                msg: 'El usuario no existe'
            });
        }

        //validar password
        const validPassword = bcrypt.compareSync( password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: true,
                msg: 'Password incorrecto'
            });
        }

        //Generar JWT
        const token = await generarJWT( usuario.id, usuario.name);

        //devolver respuesta
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error'
        })
    }

    
    
}  

const revalidarToken = async (req, res = response) => {

    const uid = req.uid;
    const name = req.name;

    //Generar JWT
    const token = await generarJWT( uid, name);

    res.json({
        ok: true,
        uid,
        name,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}