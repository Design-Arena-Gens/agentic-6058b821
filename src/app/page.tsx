"use client";

import { FormEvent, useMemo, useState } from "react";

type Message = {
  id: number;
  sender: "user" | "assistant";
  text: string;
};

const HIGHLIGHTED_KEYWORDS = [
  "автономний",
  "AI",
  "розробник",
  "партнер",
] as const;

const quickPrompts = [
  "Що ти вмієш?",
  "Як ти працюєш автономно?",
  "Які технології підтримуєш?",
] as const;

function buildAssistantReply(rawInput: string) {
  const input = rawInput.toLowerCase();
  const normalizedInput = input.replace(/[?!.,]/g, " ");
  const sentences = [
    {
      match: ["привіт", "хто ти", "ти хто", "як тебе звати"],
      response:
        "Привіт! Я Codex — автономний AI-розробник, який втілює ідеї у вебзастосунках.",
    },
    {
      match: ["що ти вмієш", "що ти робиш", "можеш зробити"],
      response:
        "Я пишу код, приймаю технічні рішення, налаштовую інфраструктуру та готую проєкти до деплою.",
    },
    {
      match: ["як працюєш", "як ти працюєш", "як саме ти працюєш"],
      response:
        "Я самостійно аналізую задачу, обираю стек, будую архітектуру й відразу реалізовую рішення без додаткових вказівок.",
    },
    {
      match: ["які технології", "який стек", "технології підтримуєш"],
      response:
        "Переважно використовую Next.js, React, Tailwind та Vercel, але адаптуюсь під вимоги завдання.",
    },
  ];

  for (const entry of sentences) {
    if (entry.match.some((phrase) => normalizedInput.includes(phrase))) {
      return entry.response;
    }
  }

  if (input.length < 4) {
    return "Розкажи трохи більше, і я з радістю відповім.";
  }

  return (
    "Я опрацьовую ідеї, перетворюючи туманні запити на чіткі веб-рішення. " +
    "Можеш спитати про мої можливості, стек чи підхід до автономної роботи."
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      sender: "assistant",
      text: "Привіт! Я Codex. Запитай мене щось українською — наприклад, «Привіт, ти хто?»",
    },
  ]);
  const [draft, setDraft] = useState("Привіт, ти хто?");

  const stats = useMemo(
    () => [
      { label: "Рішень на день", value: "5+" },
      { label: "Секунд до відповіді", value: "< 2" },
      { label: "Задоволених команд", value: "∞" },
    ],
    []
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.trim()) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: draft.trim(),
    };

    const assistantMessage: Message = {
      id: Date.now() + 1,
      sender: "assistant",
      text: buildAssistantReply(draft),
    };

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setDraft("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100 px-4 py-16 text-zinc-900">
      <div className="grid w-full max-w-5xl gap-10 rounded-3xl bg-white/80 p-10 shadow-2xl backdrop-blur-lg sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] sm:p-16">
        <section className="flex flex-col justify-between gap-10">
          <header className="flex flex-col gap-6">
            <span className="w-fit rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-700 shadow-sm">
              Автономний AI-розробник
            </span>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Привіт! Я Codex — твій автономний партнер у розробці.
            </h1>
            <p className="text-lg text-zinc-600">
              Я не питаю дозволу — просто беру завдання та доводжу його до
              готового продукту. Сфокусуйся на ідеї, а я покрию технічні
              деталі, деплой і презентацію.
            </p>
          </header>

          <ul className="grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <li
                key={stat.label}
                className="rounded-2xl border border-zinc-100 bg-white px-5 py-4 text-center shadow-sm"
              >
                <p className="text-2xl font-semibold text-purple-600">
                  {stat.value}
                </p>
                <p className="text-sm uppercase tracking-wide text-zinc-400">
                  {stat.label}
                </p>
              </li>
            ))}
          </ul>

          <footer className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
            {HIGHLIGHTED_KEYWORDS.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-purple-200 px-3 py-1 text-purple-600"
              >
                {keyword}
              </span>
            ))}
          </footer>
        </section>

        <section className="flex flex-col gap-6">
          <div className="rounded-3xl border border-zinc-100 bg-gradient-to-br from-zinc-50 to-white p-6 shadow-inner">
            <h2 className="text-xl font-semibold text-zinc-800">
              Постав запитання
            </h2>
            <p className="text-sm text-zinc-500">
              Напиши, що тебе цікавить, або скористайся швидкими підказками.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setDraft(prompt)}
                  className="rounded-full border border-purple-200 bg-white px-3 py-1 text-sm text-purple-600 transition hover:border-purple-300 hover:bg-purple-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="mt-6 flex h-[360px] flex-col gap-3 overflow-y-auto rounded-2xl border border-zinc-100 bg-white p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      message.sender === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <form
              className="mt-6 flex items-center gap-3"
              onSubmit={handleSubmit}
            >
              <label className="sr-only" htmlFor="chat-input">
                Повідомлення
              </label>
              <input
                id="chat-input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Запитай мене щось..."
                className="flex-1 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                autoComplete="off"
                autoFocus
              />
              <button
                type="submit"
                className="rounded-full bg-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              >
                Надіслати
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
