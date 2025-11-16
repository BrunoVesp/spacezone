import AuthenticationContainer from "../../components/AuthenticationContainer";
import AuthenticationButton from "../../components/AuthenticationContainer/AuthenticationButton";
import Container from "../../components/Container";
import Fieldset from "../../components/Fieldset";
import Input from "../../components/Input";
import './login.scss';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "../../schemas/loginSchema";
import ErrorMessage from "../../components/ErrorMessage";
import { http } from "../../http/http";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginSchema>({
        mode: "all",
        defaultValues: {
            email: "",
            password: ""
        },
        resolver: zodResolver(loginSchema)
    });

    const onSubmitLogin = (formData: LoginSchema) => {
        http.post("/users/login", formData)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                if (error.response?.status === 401) {
                    console.log("Credenciais inválidas");
                } else {
                    console.log("Erro inesperado", error);
                }
            });
    }

    return (
        <Container>
            <div className="loginPage">
                <AuthenticationContainer
                    title="Bem Vindo de Volta!"
                    description="Faça login para acessar sua conta SpaceZone."
                    onSubmit={handleSubmit(onSubmitLogin)}
                >
                    <Fieldset>
                        <label htmlFor="email">Email</label>
                        <Input
                            variant="email"
                            type="text"
                            id="email"
                            {...register('email')}
                        />
                        {errors.email &&
                            <ErrorMessage>{errors.email.message}</ErrorMessage>}
                    </Fieldset>
                    <Fieldset>
                        <label htmlFor="password">Senha</label>
                        <Input
                            variant="password"
                            type="password"
                            id="password"
                            {...register('password')}
                        />
                        {errors.password &&
                            <ErrorMessage>{errors.password.message}</ErrorMessage>}
                    </Fieldset>
                    <AuthenticationButton>Entrar</AuthenticationButton>
                </AuthenticationContainer>
            </div>
        </Container>
    );
}

export default Login;