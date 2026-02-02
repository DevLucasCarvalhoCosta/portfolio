"use client";

import { useEffect } from "react";

export function ConsoleArt() {
  useEffect(() => {
    // Simple ASCII Art that works in console
    const art = `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     ██╗     ██╗   ██╗ ██████╗ █████╗ ███████╗            ║
║     ██║     ██║   ██║██╔════╝██╔══██╗██╔════╝            ║
║     ██║     ██║   ██║██║     ███████║███████╗            ║
║     ██║     ██║   ██║██║     ██╔══██║╚════██║            ║
║     ███████╗╚██████╔╝╚██████╗██║  ██║███████║            ║
║     ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝            ║
║                                                           ║
║            Full Stack Software Engineer                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `;

    const styles = {
      art: 'color: #a855f7; font-size: 12px; font-weight: bold; line-height: 1.2;',
      title: 'color: #a855f7; font-size: 16px; font-weight: bold;',
      subtitle: 'color: #8b5cf6; font-size: 13px; font-weight: bold;',
      info: 'color: #c4b5fd; font-size: 11px;',
      link: 'color: #22c55e; font-size: 12px; font-weight: bold;',
      highlight: 'background: linear-gradient(90deg, #a855f7, #ec4899); color: white; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 13px;',
      emoji: 'font-size: 14px;',
    };

    console.clear(); // Limpa o console para melhor visualização
    console.log('%c' + art, styles.art);
    console.log('%c💻 TypeScript • React • Node.js • Next.js', styles.info);
    console.log('%c📍 Goiânia, GO - Brasil', styles.info);
    console.log('');
    console.log('%c👋 Olá! Seja bem-vindo ao meu portfolio!', styles.subtitle);
    console.log('%cSe você está lendo isso, provavelmente é um desenvolvedor curioso... Eu também! 😄', styles.info);
    console.log('');
    console.log('%c💼 QUER ME CONTRATAR?', styles.highlight);
    console.log('');
    console.log('%c📱 WhatsApp → %chttps://wa.me/5562995390505', styles.emoji, styles.link);
    console.log('%c📧 Email → %cdev.lucascarvalho@gmail.com', styles.emoji, styles.link);
    console.log('%c🔗 LinkedIn → %chttps://www.linkedin.com/in/devlucascarvalhocosta/', styles.emoji, styles.link);
    console.log('%c🐙 GitHub → %chttps://github.com/DevLucasCarvalhoCosta', styles.emoji, styles.link);
    console.log('');
    console.log('%c⭐ Gostou do portfolio? Deixe uma estrela no GitHub!', styles.info);
    console.log('%c   https://github.com/DevLucasCarvalhoCosta', styles.link);
    console.log('');
    console.log('%c💡 Dica: Você pode abrir este console a qualquer momento com F12', styles.info);
  }, []);

  return null;
}
