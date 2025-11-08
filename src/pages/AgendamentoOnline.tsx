import React from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { InputForm } from '../components/InputForm'; 

type AgendamentoInputs = {
    nome: string;
    email: string;
    especialidade: string;
    data: string;
};

const AgendamentoOnline: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<AgendamentoInputs>();
    
    const onSubmit: SubmitHandler<AgendamentoInputs> = data => {
        console.log("Agendamento Solicitado:", data);
        alert('Agendamento solicitado com sucesso! Nossa equipe entrará em contato para confirmação.');
    };

    return (
        <div className="flex text-gray-700 justify-center p-4 md:p-8 bg-hc-fundo min-h-screen"> 
            {}
            <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-xl border border-gray-100"> 
                
                {}
                <h1 className="text-3xl font-extrabold text-hc-principal mb-2 border-b pb-2 text-gray-500 mb-8">Solicitação de Agendamento</h1>
                <p className="text-gray-700 mb-8">Preencha os dados e entraremos em contato para confirmar a disponibilidade.</p>

                <form onSubmit={handleSubmit(onSubmit)}> 
                    
                    {}
                    <InputForm 
                      label="Nome Completo "
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

                    {}
                    <div className="mb-4">
                        <label htmlFor="especialidade" className="block text-gray-700 font-medium mb-1">Especialidade Desejada</label>
                        <select
                            id="especialidade"
                            className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg transition duration-150 focus:ring-2 focus:ring-hc-secundaria focus:border-hc-secundaria appearance-none bg-white"
                            {...register("especialidade", { required: "Selecione uma especialidade." })}
                        >
                            <option value="">-- Selecione --</option>
                            <option value="cardiologia">Cardiologia</option>
                            <option value="pediatria">Pediatria</option>
                            <option value="ortopedia">Ortopedia</option>
                            <option value="neurologia">Neurologia</option>
                        </select>
                         {errors.especialidade && <p className="text-red-500 text-sm mt-1">{String(errors.especialidade.message)}</p>}
                    </div>

                    <InputForm 
                      label="Data Desejada"
                      name="data"
                      type="date"
                      register={register}
                      errors={errors}
                      rules={{ required: "A data é obrigatória." }}
                    />

                    {}
                    <button 
                        type="submit" 
                        className="mt-6 text-gray-700 w-full bg-hc-secundaria text-hc-principal font-bold py-3 rounded-lg shadow-md hover:bg-hc-principal hover:text-white transition duration-200 focus:outline-none focus:ring-4 focus:ring-hc-secundaria/50"
                    >
                        Confirmar Solicitação
                    </button>

                </form>
            </div>
        </div>
    );
};

export default AgendamentoOnline;