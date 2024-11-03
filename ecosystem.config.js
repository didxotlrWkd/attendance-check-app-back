module.exports = {
    apps: [
      {
        name: 'attendance_app',      // 애플리케이션 이름
        script: 'app.js',             // 시작할 파일
        instances: 'max',             // 최대 인스턴스 수
        watch: false,                 // 파일 변경 감시 비활성화
        exec_mode: 'cluster',         // 클러스터 모드로 실행
        env: {                        // 기본 환경 변수 설정
          NODE_ENV: 'production',     // 기본 NODE_ENV 설정
        },
        env_development: {            // 개발 환경 변수 설정
          NODE_ENV: 'development',    // 개발 환경의 NODE_ENV 설정
        }
      }
    ]
  };
  