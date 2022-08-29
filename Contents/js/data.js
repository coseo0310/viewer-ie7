//샘플 데이터 (처방전 목록)
var jsonData = [
  {
    id: 1,
    thumbnail: [
      "/viewer-ie7/Contents/sample/thumbnail/RX1.png",
      "/viewer-ie7/Contents/sample/thumbnail/RX2.png",
    ],
    images: [
      "/viewer-ie7/Contents/sample/RX1.png",
      "/viewer-ie7/Contents/sample/RX1.png",
    ],
    name: "김준환",
    RegistDate: "200722",
    code: "012345678",
    Register: "김준환",
  },
  {
    id: 2,
    thumbnail: [
      "/viewer-ie7/Contents/sample/thumbnail/RX1.png",
      "/viewer-ie7/Contents/sample/thumbnail/RX2.png",
    ],
    images: [
      "/viewer-ie7/Contents/sample/RX1.png",
      "/viewer-ie7/Contents/sample/RX1.png",
    ],
    name: "홍길동",
    RegistDate: "200722",
    code: "012345678",
    Register: "김준환",
  },
  {
    id: 3,
    thumbnail: ["/viewer-ie7/Contents/sample/thumbnail/RX1.png"],
    images: ["/viewer-ie7/Contents/sample/RX1.png"],
    name: "고길동",
    RegistDate: "200722",
    code: "012345678",
    Register: "김준환",
  },
  {
    id: 4,
    thumbnail: ["/viewer-ie7/Contents/sample/thumbnail/RX2.png"],
    images: ["/viewer-ie7/Contents/sample/RX1.png"],
    name: "정명석",
    RegistDate: "200722",
    code: "012345678",
    Register: "김준환",
  },
  {
    id: 5,
    thumbnail: ["/viewer-ie7/Contents/sample/thumbnail/RX1.png"],
    images: ["/viewer-ie7/Contents/sample/RX1.png"],
    name: "우영우",
    RegistDate: "200722",
    code: "012345678",
    Register: "김준환",
  },
  {
    id: 6,
    thumbnail: ["/viewer-ie7/Contents/sample/thumbnail/RX1.png"],
    images: ["/viewer-ie7/Contents/sample/RX1.png"],
    name: "이준호",
    RegistDate: "200722",
    code: "012345678",
    Register: "김준환",
  },
  {
    id: 7,
    thumbnail: ["/viewer-ie7/Contents/sample/thumbnail/RX1.png"],
    images: ["/viewer-ie7/Contents/sample/RX1.png"],
    name: "고길동",
    RegistDate: "200722",
    code: "012345678",
    Register: "김준환",
  },
  {
    id: 8,
    thumbnail: ["/viewer-ie7/Contents/sample/thumbnail/RX2.png"],
    images: ["/viewer-ie7/Contents/sample/RX1.png"],
    name: "정명석",
    RegistDate: "200722",
    code: "012345678",
    Register: "김준환",
  },
  {
    id: 9,
    thumbnail: ["/viewer-ie7/Contents/sample/thumbnail/RX1.png"],
    images: ["/viewer-ie7/Contents/sample/RX1.png"],
    name: "우영우",
    RegistDate: "200722",
    code: "012345678",
    Register: "김준환",
  },
  {
    id: 10,
    thumbnail: ["/viewer-ie7/Contents/sample/thumbnail/RX1.png"],
    images: ["/viewer-ie7/Contents/sample/RX1.png"],
    name: "이준호",
    RegistDate: "200722",
    code: "012345678",
    Register: "김준환",
  },
  {
    id: 11,
    thumbnail: ["/viewer-ie7/Contents/sample/thumbnail/RX1.png"],
    images: ["/viewer-ie7/Contents/sample/RX1.png"],
    name: "고길동",
    RegistDate: "200722",
    code: "012345678",
    Register: "김준환",
  },
  {
    id: 12,
    thumbnail: ["/viewer-ie7/Contents/sample/thumbnail/RX2.png"],
    images: ["/viewer-ie7/Contents/sample/RX1.png"],
    name: "정명석",
    RegistDate: "200722",
    code: "012345678",
    Register: "김준환",
  },
  {
    id: 13,
    thumbnail: ["/viewer-ie7/Contents/sample/thumbnail/RX1.png"],
    images: ["/viewer-ie7/Contents/sample/RX1.png"],
    name: "우영우",
    RegistDate: "200722",
    code: "012345678",
    Register: "김준환",
  },
  {
    id: 14,
    thumbnail: ["/viewer-ie7/Contents/sample/thumbnail/RX1.png"],
    images: ["/viewer-ie7/Contents/sample/RX1.png"],
    name: "이준호",
    RegistDate: "200722",
    code: "012345678",
    Register: "김준환",
  },
];

//Init 함수
$(document).ready(function () {
  //jsonData 데이터를 ajax로 불러옵니다.
  //$.post("/api/url", { parameter : parameterValue }, function(list) {
  //  fnLoadPrescription('PageContentList', 'prescriptionView', list);
  //});

  fnLoadPrescription("PageContentList", "prescriptionView", jsonData);
});
