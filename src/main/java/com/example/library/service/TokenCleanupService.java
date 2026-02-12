package com.example.library.service;

import com.example.library.repository.ConfirmationTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class TokenCleanupService {
    private final ConfirmationTokenRepository tokenRepository;


    @Scheduled(fixedRate = 12, timeUnit = TimeUnit.HOURS)//Чистка каждык 12 часов, 43200000 милесекунд
    @Transactional
    public void removeExpiredTokens() {
        System.out.println("" +
                "" +
                "　∧＿∧\n" +
                "（｡･ω･｡)つ━☆・*。\n" +
                "⊂　　 ノ 　　　・゜+.\n" +
                "　しーＪ　　　°。+ *´¨)\n" +

                "　　　　　　　　　.• ´¸.•*´¨) ¸.•*¨)\n" +
                "　　　　　　　　　　(¸.•´ (¸.•’* " +
                "\n" +
                "\n" +
                "\n" +
                "く__,.ヘヽ.　　　　/　,ー､ 〉\n" +
                "　　　　　＼ ', !-─‐-i　/　/´\n" +
                "　　　 　 ／｀ｰ'　　　 L/／｀ヽ､\n" +
                "　　 　 /　 ／,　 /|　 ,　 ,　　　 ',\n" +
                "　　　ｲ 　/ /-‐/　ｉ　L_ ﾊ ヽ!　 i\n" +
                "　　　 ﾚ ﾍ 7ｲ｀ﾄ　 ﾚ'ｧ-ﾄ､!ハ|　 |\n" +
                "　　　　 !,/7 '0'　　 ´0iソ| 　 |　　　\n" +
                "　　　　 |.从\"　　_　　 ,,,, / |./ 　 |\n" +
                "　　　　 ﾚ'| i＞.､,,__　_,.イ / 　.i 　|\n" +
                "　　　　　 ﾚ'| | / k_７_/ﾚ'ヽ,　ﾊ.　|\n" +
                "　　　　　　 | |/i 〈|/　 i　,.ﾍ |　i　|\n" +
                "　　　　　　.|/ /　ｉ： 　 ﾍ!　　＼　|\n" +
                "　　　 　 　 kヽ>､ﾊ 　 _,.ﾍ､ 　 /､!\n" +
                "　　　　　　 !'〈//｀Ｔ´', ＼ ｀'7'ｰr'\n" +
                "　　　　　　 ﾚ'ヽL__|___i,___,ンﾚ|ノ\n" +
                "　　　　　 　　　ﾄ-,/　|___./\n" +
                "　　　　　 　　　'ｰ'　　!_,.: " +
                "\n" +
                "\n" +
                "Дворник вышел на работу: чистим старые токены..." +
                "\n" +
                "\n");
        tokenRepository.deleteAllByExpiresAtBefore(LocalDateTime.now());


    }
}