
(async function () {

    try {
      const runner = await import('./index.mjs');
        await runner.handler({
            "Records": [
              {
                "EventSource": "aws:sns",
                "EventVersion": "1.0",
                "EventSubscriptionArn": "arn:aws:sns:us-east-1:{{{accountId}}}:ExampleTopic",
                "Sns": {
                  "Type": "Notification",
                  "MessageId": "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
                  "TopicArn": "arn:aws:sns:us-east-1:123456789012:ExampleTopic",
                  "Subject": "example subject",
                  "Message": {
                    "notificationType": "Received",
                    "mail": {
                      "timestamp": "2024-02-03T22:23:45.815Z",
                      "source": "oluwatobiloba.f.a@gmail.com",
                      "messageId": "uh1eef22ivo39u2ok5mcocps4n27b2qiaa004f01",
                      "destination": [
                        "admin@technoob.tech"
                      ],
                      "headersTruncated": false,
                      "headers": [
                        {
                          "name": "Return-Path",
                          "value": "<oluwatobiloba.f.a@gmail.com>"
                        },
                        {
                          "name": "Received",
                          "value": "from mail-wr1-f49.google.com (mail-wr1-f49.google.com [209.85.221.49]) by inbound-smtp.eu-west-2.amazonaws.com with SMTP id uh1eef22ivo39u2ok5mcocps4n27b2qiaa004f01 for admin@technoob.tech; Sat, 03 Feb 2024 22:23:45 +0000 (UTC)"
                        },
                        {
                          "name": "X-SES-Spam-Verdict",
                          "value": "PASS"
                        },
                        {
                          "name": "X-SES-Virus-Verdict",
                          "value": "PASS"
                        },
                        {
                          "name": "Received-SPF",
                          "value": "pass (spfCheck: domain of _spf.google.com designates 209.85.221.49 as permitted sender) client-ip=209.85.221.49; envelope-from=oluwatobiloba.f.a@gmail.com; helo=mail-wr1-f49.google.com;"
                        },
                        {
                          "name": "Authentication-Results",
                          "value": "amazonses.com; spf=pass (spfCheck: domain of _spf.google.com designates 209.85.221.49 as permitted sender) client-ip=209.85.221.49; envelope-from=oluwatobiloba.f.a@gmail.com; helo=mail-wr1-f49.google.com; dkim=pass header.i=@gmail.com; dmarc=pass header.from=gmail.com;"
                        },
                        {
                          "name": "X-SES-RECEIPT",
                          "value": "AEFBQUFBQUFBQUFKcUFsbnZmTCtBZDZQc0xzenY0bGFHL3hRUFlBUGIreHhpOU1ZQ2ZYeW03YU9YYWFZWEZlZVlHSkkyVWsyWGE3dHh2d1VHRUVRRHRORE1QaUYwTVFtTDdBbW51em15azRkeTV3ZUkzdTdRWUx2cVNmdHo3WWZseTVPSmM4aHhqdDRMOENzVTI1cmkvbFI1NkdnUzV6M3lGQnZEOUFYMjcxUHBlOXFmVjRsK1cvOVlNY1o1K1BpUkd2YjR4WUtxcytrOXFKS0ZQWHhYSGphbWtkRG9xV0lIaXFPa1phRnhaQkVtRzhPNk8wZzdzQ0xtTEpXeU40SzNVWWlTWngydit5QWZ2NStXQ253emxtQTVIcVhnYm5ORklyQUNBcTUvbFRPRjZQd2xTT3pNT0E9PQ=="
                        },
                        {
                          "name": "X-SES-DKIM-SIGNATURE",
                          "value": "a=rsa-sha256; q=dns/txt; b=nrFSN/et5fusVpqS3dZeOVHezmGNd03/Jg1+M9BZg3X7GG04+WVkvDsOroEejXIYlQOHemlnbIMPa3uM63djt76zAcplm5qS+d2fnDD4wALwFF3Myevvf0mjTKOtjvtUG79vImS7tQjfV5Nguw5o0okI/FB5JpNiUk4RezXNbxs=; c=relaxed/simple; s=smjs5bczbyxi6u2ua6eveuxqal7joyry; d=amazonses.com; t=1706999026; v=1; bh=ZeEHwtszHl7ctGZk2vCXNgGiOgT7IE2hyccblMn2dRI=; h=From:To:Cc:Bcc:Subject:Date:Message-ID:MIME-Version:Content-Type:X-SES-RECEIPT;"
                        },
                        {
                          "name": "Received",
                          "value": "by mail-wr1-f49.google.com with SMTP id ffacd0b85a97d-33b123f99d6so2019658f8f.2 for <admin@technoob.tech>; Sat, 03 Feb 2024 14:23:45 -0800 (PST)"
                        },
                        {
                          "name": "DKIM-Signature",
                          "value": "v=1; a=rsa-sha256; c=relaxed/relaxed; d=gmail.com; s=20230601; t=1706999025; x=1707603825; darn=technoob.tech; h=message-id:in-reply-to:to:references:date:subject:mime-version:content-transfer-encoding:from:from:to:cc:subject:date:message-id:reply-to; bh=ZeEHwtszHl7ctGZk2vCXNgGiOgT7IE2hyccblMn2dRI=; b=BupBekHlJFIcr/ZSHLfg2BgHi9ShJuYzIKfZu9Mp5E0CWgcQEtg6x+71ggO8x5xopWXjoVjq6W7Hk3mDJuQE9xqkrnY9l4rmZF9l0vuMKji8hB3JVp1zC+FZ4T41Lp4rRftgbOiY0vSDK/z2wh678atjbJy3f8mlJU1YfNGLLJ3K5ll7F4GvjfRsiCrr3nsUX977ndBtdsnTaTfZTllVPFe6Dz+DJqGifaTNDJo9qFqiG6bpntmDFYk/6GWIspXfVvgs8THx+ztRNtnofURSx6+bV0qYWmTLJr01XxIwOLjDNC+xwZeK/9JLUhROusEHmutziAUHQ3e8mdytUxGWLA=="
                        },
                        {
                          "name": "X-Google-DKIM-Signature",
                          "value": "v=1; a=rsa-sha256; c=relaxed/relaxed; d=1e100.net; s=20230601; t=1706999025; x=1707603825; h=message-id:in-reply-to:to:references:date:subject:mime-version :content-transfer-encoding:from:x-gm-message-state:from:to:cc :subject:date:message-id:reply-to; bh=ZeEHwtszHl7ctGZk2vCXNgGiOgT7IE2hyccblMn2dRI=; b=EASgP8YFVCNqoGHNh2wPagtbVQ2tlVpxkyuUd84x1XQzpu9dWXgFeO2W2qCxFHU9+M D2IXAYE98SPgYQSzkUbZ65VisgouFVkd+iYedw/iknn4PdNuYxaGgt74yaTICvf6E3GL 3eX0zP5d+dpLjpQpG2NhUqjKF3ArdhJ5vdB99liEvQRhLu0ZRRFVgQRtqp0j+9guBj83 fHZgQdWAXDGwEZPgPOoJqm4S2OxC/tJqFlVH0cEfsBtEPM2BgYU62xUU4QZSpzhK1Wi/ NUC1pUZ3Vj1Si4BAkIZ+lOh1B+D+bk/BIC9ZIpbiRBz8eZzgcov0bvgw1LZl3Z6z4ggS +C+A=="
                        },
                        {
                          "name": "X-Gm-Message-State",
                          "value": "AOJu0YzF8crT2paXdkwifUUPkI2UWABxwiZJWxSSdxUz1TRcs4Y6xF9q z0SSMohz/9uOPiRAhHW+LZPYqvMMFjmIGvYvHEuV9g3uhp/DHaok6tCiRJT4D+Q0Wg=="
                        },
                        {
                          "name": "X-Google-Smtp-Source",
                          "value": "AGHT+IFyhvQnDQj1NYmDzAX+FLFK1kC+HkEUIyJZl1Ad0EnjjqgNb+3n+NmYNHjV3eUmkb0zvYKIJw=="
                        },
                        {
                          "name": "X-Received",
                          "value": "by 2002:adf:a1c8:0:b0:33b:356c:e95e with SMTP id v8-20020adfa1c8000000b0033b356ce95emr575698wrv.49.1706999024934; Sat, 03 Feb 2024 14:23:44 -0800 (PST)"
                        },
                        {
                          "name": "Return-Path",
                          "value": "<oluwatobiloba.f.a@gmail.com>"
                        },
                        {
                          "name": "Received",
                          "value": "from smtpclient.apple ([105.112.202.27]) by smtp.gmail.com with ESMTPSA id z12-20020adfe54c000000b0033940016d6esm4776572wrm.93.2024.02.03.14.23.44 for <admin@technoob.tech> (version=TLS1_2 cipher=ECDHE-ECDSA-AES128-GCM-SHA256 bits=128/128); Sat, 03 Feb 2024 14:23:44 -0800 (PST)"
                        },
                        {
                          "name": "From",
                          "value": "Oluwatobiloba Aremu <oluwatobiloba.f.a@gmail.com>"
                        },
                        {
                          "name": "Content-Type",
                          "value": "text/plain; charset=us-ascii"
                        },
                        {
                          "name": "Content-Transfer-Encoding",
                          "value": "quoted-printable"
                        },
                        {
                          "name": "Mime-Version",
                          "value": "1.0 (Mac OS X Mail 16.0 \\(3774.400.31\\))"
                        },
                        {
                          "name": "Subject",
                          "value": "Re: TEST Email"
                        },
                        {
                          "name": "Date",
                          "value": "Sat, 3 Feb 2024 23:23:10 +0100"
                        },
                        {
                          "name": "References",
                          "value": "<692AD473-8A3F-4429-8828-01820636C986@gmail.com>"
                        },
                        {
                          "name": "To",
                          "value": "admin@technoob.tech"
                        },
                        {
                          "name": "In-Reply-To",
                          "value": "<692AD473-8A3F-4429-8828-01820636C986@gmail.com>"
                        },
                        {
                          "name": "Message-Id",
                          "value": "<58FE2761-841F-4DA0-B5F5-D08D0923E45B@gmail.com>"
                        },
                        {
                          "name": "X-Mailer",
                          "value": "Apple Mail (2.3774.400.31)"
                        }
                      ],
                      "commonHeaders": {
                        "returnPath": "oluwatobiloba.f.a@gmail.com",
                        "from": [
                          "Oluwatobiloba Aremu <oluwatobiloba.f.a@gmail.com>"
                        ],
                        "date": "Sat, 3 Feb 2024 23:23:10 +0100",
                        "to": [
                          "admin@technoob.tech"
                        ],
                        "messageId": "<58FE2761-841F-4DA0-B5F5-D08D0923E45B@gmail.com>",
                        "subject": "Re: TEST Email"
                      }
                    },
                    "receipt": {
                      "timestamp": "2024-02-03T22:23:45.815Z",
                      "processingTimeMillis": 639,
                      "recipients": [
                        "admin@technoob.tech"
                      ],
                      "spamVerdict": {
                        "status": "PASS"
                      },
                      "virusVerdict": {
                        "status": "PASS"
                      },
                      "spfVerdict": {
                        "status": "PASS"
                      },
                      "dkimVerdict": {
                        "status": "PASS"
                      },
                      "dmarcVerdict": {
                        "status": "PASS"
                      },
                      "action": {
                        "type": "S3",
                        "topicArn": "arn:aws:sns:eu-west-2:060344919694:admin-ses-emails",
                        "bucketName": "emails-technoob",
                        "objectKey": "uh1eef22ivo39u2ok5mcocps4n27b2qiaa004f01"
                      }
                    }
                  },
                  "Timestamp": "1970-01-01T00:00:00.000Z",
                  "SignatureVersion": "1",
                  "Signature": "EXAMPLE",
                  "SigningCertUrl": "EXAMPLE",
                  "UnsubscribeUrl": "EXAMPLE",
                  "MessageAttributes": {
                    "Test": {
                      "Type": "String",
                      "Value": "TestString"
                    },
                    "TestBinary": {
                      "Type": "Binary",
                      "Value": "TestBinary"
                    }
                  }
                }
              }
            ]
          })
  } catch (error) {
    console.log(error)
  }
})();
