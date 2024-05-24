import { Input } from "@/components/ui/input";
import { BadgeInfo } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

export function Auth() {
  return (
    <>
      <Helmet
        title="Cadastrar serviço"
        link={[{ href: "./short_logo.png", rel: 'shortcut icon' }]}
      />
      <div className="w-full h-screen flex justify-center md:grid md:grid-cols-2">
        <div className="md:flex hidden flex-col space-y-14  items-center justify-center  bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-30 h-14 object-cover"
            />
          <img src="./banner_auth.png" alt="" />
        </div>
        <div className="w-full md:p-16 p-5 rounded-md mx-auto flex flex-col space-y-12 justify-center">
          <div className="w-full mt-8 flex flex-col md:space-y-3 space-y-6 items-start">
            <h1 className="font-bold md:text-4xl text-3xl text-zinc-600">Entrar</h1>

            <p className=" text-zinc-400 max-w-md text-start md:text-base text-sm">
              Use suas credenciais para entrar na plataforma e ter acesso à
              nossas funcionalidades.
            </p>
          </div>

          <form
            className="w-full flex flex-col items-start justify-center gap-4 md:mt-10 mt-3"
          >
            <div className="w-full flex flex-col">
              <label className="text-md text-zinc-500">
                Endereço de e-mail
              </label>

              <Input
                placeholder="Digite o seu endereço de e-mail"
              />
            </div>

            <div className="w-full flex flex-col">
              <label className="text-md text-zinc-500">Senha</label>
              <Input
                placeholder="Digite sua senha"
              />

              <div className="w-full flex justify-end items-center mt-1">
                <a
                  href="/email"
                  className="text-xs text-slate-400 cursor-pointer hover:text-gray-500 duration-150"
                >
                  Esqueceu sua senha?
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-yellow-200 text-zinc-400 text-xs flex items-center justify-center border-2 border-yellow-300 rounded-md">
                <BadgeInfo />
              </div>
              <label className="text-xs text-zinc-500">
                Aceito compartilhar minhas informações com o Gestor Combate
              </label>
            </div>

            <button
              type="submit"
              className="bg-zinc-800 flex items-center text-sm justify-center text-white w-full h-12 rounded-md mt-5 hover:bg-zinc-900 transition-all disabled:hover:bg-zinc-800 disabled:opacity-80 disabled:cursor-not-allowed"
            >
              Acessar
            </button>
          </form>
        </div>
      </div>
    </>
  )
}