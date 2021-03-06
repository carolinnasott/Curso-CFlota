USE [SISEP_ControlFlota]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Servicio](
	[servId] [int] IDENTITY(1,1) NOT NULL,
	[servNombre] [varchar](100) NULL,
	[servDescripcion] [varchar](200) NULL,
	[servPeriodo] [int] NULL,
	[servKM] [int] NULL,
	[servFecha] [bit] NULL,
	[servFechaAlta] [datetime] NULL,
	[servBorrado] [bit] NOT NULL,
 CONSTRAINT [PK_Servicio] PRIMARY KEY CLUSTERED 
(
	[servId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
