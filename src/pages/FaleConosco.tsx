import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { InputForm } from '../components/InputForm'; 

type ContatoInputs = {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
};

const FaleConosco: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContatoInputs>();
  
  const onSubmit: SubmitHandler<ContatoInputs> = data => {
    console.log("Mensagem Enviada:", data);
    alert('Sua mensagem foi enviada ao Hospital das Clínicas. Responderemos em breve.');
    reset();
  };

  return (
    <div className="flex justify-center p-4 md:p-8 bg-hc-fundo min-h-screen">
      {}
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl">
        
        {}
        <h1 className="text-3xl text-gray-700 font-extrabold text-hc-principal mb-2 text-center border-b pb-2">Entre em Contato</h1>
        <p className="text-gray-500 mb-8 text-center">Use o formulário abaixo ou veja nossos canais de atendimento.</p>

        <form onSubmit={handleSubmit(onSubmit)}>
            
            {}
            <InputForm
              label="Nome Completo"
              name="nome"
              register={register}
              errors={errors}
              rules={{ required: "O nome é obrigatório." }}
            />

            <InputForm
              label="E-mail"
              name="email"
              type="email"
              register={register}
              errors={errors}
              rules={{ 
                required: "O e-mail é obrigatório.", 
                pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Formato de e-mail inválido."
                }
              }}
            />

            <InputForm
              label="Assunto"
              name="assunto"
              register={register}
              errors={errors}
              rules={{ required: "O assunto é obrigatório." }}
            />

            {}
            <div className="mb-6">
                <label htmlFor="mensagem" className="block text-gray-700 font-medium mb-1">Sua Mensagem</label>
                <textarea
                    id="mensagem"
                    rows={4}
                    className={`w-full p-3 border rounded-lg transition duration-150 
                        ${errors.mensagem ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-hc-secundaria focus:border-hc-secundaria'}`}
                    {...register("mensagem", { required: "A mensagem é obrigatória.", minLength: { value: 10, message: "A mensagem deve ter no mínimo 10 caracteres." } })}
                ></textarea>
                {errors.mensagem && <p className="text-red-500 text-sm mt-1">{String(errors.mensagem.message)}</p>}
            </div>


            {}
            <button 
                type="submit" 
                className="w-full bg-hc-secundaria text-gray-700 font-bold py-3 rounded-lg shadow-md hover:bg-hc-principal transition duration-150 focus:outline-none focus:ring-4 focus:ring-hc-secundaria/50"
            >
                Enviar Mensagem
            </button>
        </form>
      </div>
    </div>
  );
};

export default FaleConosco;