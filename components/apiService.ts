import { API_BASE_URL } from './config';

// Interface para os dados do formulário de registro
interface RegistrationData {
    fullName: string;
    phone: string;
    email: string;
    password: string;
}

/**
 * Função genérica para tratar respostas da API
 */
const handleResponse = async (response: Response) => {
    const data = await response.json();
    if (!response.ok) {
        // Usa a mensagem de erro da API ou um erro padrão
        throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
};

/**
 * Registra um novo usuário.
 * O backend atual não salva fullName e phone, mas os mantemos aqui
 * para o caso de uma futura atualização da API.
 */
export const register = async (userData: RegistrationData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // O backend espera 'senha' e 'role'
        body: JSON.stringify({
            email: userData.email,
            senha: userData.password,
            role: 'user', // Define um papel padrão para o usuário
            // fullName: userData.fullName, // Backend precisa ser atualizado para receber
            // phone: userData.phone,       // Backend precisa ser atualizado para receber
        }),
    });
    return handleResponse(response);
};

/**
 * Autentica um usuário e retorna o token.
 */
export const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // O backend espera 'senha'
        body: JSON.stringify({ email, senha: password }),
    });
    return handleResponse(response);
};

/**
 * Busca os dados do usuário autenticado usando o token.
 */
export const getMe = async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/user/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};
