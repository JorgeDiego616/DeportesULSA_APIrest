const checkAuth = (context) => {
    if (!context.user) {
        throw new Error('No autorizado, debes iniciar sesión');
    }
    return context.user;
};

const checkAdmin = (context) => {
    const user = checkAuth(context);
    if (user.role !== 'admin') {
        throw new Error('No autorizado, se requiere rol de administrador');
    }
    return user;
};

module.exports = { checkAuth, checkAdmin };