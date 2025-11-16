import { useForm } from "react-hook-form";
import AuthenticationContainer from "../../components/AuthenticationContainer";
import AuthenticationButton from "../../components/AuthenticationContainer/AuthenticationButton";
import Container from "../../components/Container"
import Fieldset from "../../components/Fieldset";
import Input from "../../components/Input";
import './register.scss';
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterSchema } from "../../schemas/registerSchema";
import ErrorMessage from "../../components/ErrorMessage";
import { http } from "../../http/http";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterSchema>({
        mode: "all",
        defaultValues: {
            nickname: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        resolver: zodResolver(registerSchema)
    });

    const { addToast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onSubmitRegister = (formData: RegisterSchema) => {
        setLoading(true);
        http.post("/users", formData)
            .then(() => {
                addToast("Conta criada com sucesso!", "success");

                setTimeout(() => {
                    navigate("/login");
                }, 800);
            })
            .catch(() => {
                addToast("Ocorreu um erro ao criar sua conta.", "error");
            })
            .finally(() => setLoading(false));
    }

    return (
        <Container>
            <div className="registerPage">
                <AuthenticationContainer
                    title="Bem Vindo!"
                    description="Cadastre-se no SpaceZone."
                    onSubmit={handleSubmit(onSubmitRegister)}
                    isLogin={false}
                >
                    <Fieldset>
                        <label htmlFor="nickname">Nickname</label>
                        <Input
                            variant="user"
                            type="text"
                            id="nickname"
                            {...register('nickname')}
                        />
                        {errors.nickname &&
                            <ErrorMessage>{errors.nickname.message}</ErrorMessage>}
                    </Fieldset>
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
                    <Fieldset>
                        <label htmlFor="confirmPassword">Confirme a senha</label>
                        <Input
                            variant="password"
                            type="password"
                            id="confirmPassword"
                            {...register('confirmPassword')}
                        />
                        {errors.confirmPassword &&
                            <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}
                    </Fieldset>
                    {loading && <LoadingSpinner />}
                    <AuthenticationButton disabled={loading}>
                        {loading ? "Carregando..." : "Cadastre-se"}
                    </AuthenticationButton>
                </AuthenticationContainer>
            </div>
        </Container>
    )
}

export default Register;