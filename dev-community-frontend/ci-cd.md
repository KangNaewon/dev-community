## CI/CD 파이프라인 문서 (Frontend)

#파이프라인 구성
1. **Checkout**: GitHub develop 브랜치에서 코드 가져오기
2. **Build Frontend**: Node 20 이미지에서 npm build 수행
3. **Build Docker Image & Push**: Docker Hub에 이미지 push
4. **Deploy**: 원격 서버에 SSH로 접속해 Docker 컨테이너 재시작

#필요한 Credentials
- GitHub: `github-credentials`
- DockerHub: `dockerhub-credentials`
- SSH 키: Jenkins 서버의 ~/.ssh/id_rsa.pub 를 frontend 서버 authorized_keys 에 등록

#사용 이미지
- node:20
- nginx:alpine

#주의사항
- 서버 용량 부족하면 `df -h` 확인하고 docker system prune -af 등으로 정리 필요
